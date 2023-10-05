import { Commands } from "$commands/applicationCommands";
import {
  AudioPlayer,
  VoiceConnectionStatus,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Client, GatewayIntentBits } from "discord.js";
import { Stream } from "stream";
import { P, match } from "ts-pattern";
import Channel from "./models/Channel";
import ChannelActivity from "./models/ChannelActivity";
import ChannelCommandPair from "./models/ChannelCommandPair";
import Command from "./models/Command";
import Member from "./models/Member";
import raise from "./utils/raise";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const audioPlayer = new AudioPlayer();
// const stream = new Stream.Readable();

client
  .on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  })
  .on("voiceStateUpdate", async (oldState, newState) => {
    const command = await Command.get({ name: Commands.ChannelActivity });

    if (!command) {
      return;
    }

    match([oldState.channelId, newState.channelId])
      .with([null, null], () => {
        // 기본적으로 null, null은 없음
      })
      .with([null, P.string], async ([_oldChannelId, newChannelId]) => {
        // null, string은 join
        console.log("join");
        // check if channel registered
        const channelCommandPair = await ChannelCommandPair.get({
          channel_id: newChannelId,
          command_id: command.id,
        });

        if (!channelCommandPair) {
          return;
        }

        await Member.upsert({
          id: newState.member!.id,
          username: newState.member!.user.username,
          display_name: newState.member!.displayName,
          global_name: newState.member!.user.globalName ?? "",
          display_avatar_url: newState.member!.user.displayAvatarURL({
            size: 4096,
          }),
        });

        await ChannelActivity.insert({
          channel_id: newChannelId,
          member_id: newState.member!.id ?? raise("member is null"),
          action_type: "join",
        });
      })
      .with([P.string, null], async ([oldChannelId, _newChannelId]) => {
        // string, null은 leave
        console.log("leave");
        // check if channel registered
        const channelCommandPair = await ChannelCommandPair.get({
          channel_id: oldChannelId,
          command_id: command.id,
        });

        if (!channelCommandPair) {
          return;
        }

        await Member.upsert({
          id: oldState.member!.id,
          username: oldState.member!.user.username,
          display_name: oldState.member!.displayName,
          global_name: oldState.member!.user.globalName ?? "",
          display_avatar_url: oldState.member!.user.displayAvatarURL({
            size: 4096,
          }),
        });

        ChannelActivity.insert({
          channel_id: oldChannelId,
          member_id: oldState.member?.id ?? raise("member is null"),
          action_type: "leave",
        });
      })
      .with([P.string, P.string], async ([oldChannelId, newChannelId]) => {
        // string, string은 move or mute or deafen or stream

        match(oldChannelId === newChannelId)
          .with(true, async () => {
            // mute or deafen or stream
            // check if channel registered
            const channelCommandPair = await ChannelCommandPair.get({
              channel_id: newChannelId,
              command_id: command.id,
            });

            if (!channelCommandPair) {
              return;
            }

            match([oldState, newState])
              .when(
                ([oldState, newState]) => oldState.deaf !== newState.deaf,
                async () => {
                  await Member.upsert({
                    id: newState.member!.id,
                    username: newState.member!.user.username,
                    display_name: newState.member!.displayName,
                    global_name: newState.member!.user.globalName ?? "",
                    display_avatar_url: newState.member!.user.displayAvatarURL({
                      size: 4096,
                    }),
                  });

                  // deafen
                  await ChannelActivity.insert({
                    channel_id: newChannelId,
                    member_id: newState.member?.id ?? raise("member is null"),
                    action_type: newState.deaf ? "deafened" : "undeafened",
                  });
                }
              )
              .when(
                ([oldState, newState]) => oldState.mute !== newState.mute,
                async () => {
                  await Member.upsert({
                    id: newState.member!.id,
                    username: newState.member!.user.username,
                    display_name: newState.member!.displayName,
                    global_name: newState.member!.user.globalName ?? "",
                    display_avatar_url: newState.member!.user.displayAvatarURL({
                      size: 4096,
                    }),
                  });

                  // mute
                  await ChannelActivity.insert({
                    channel_id: newChannelId,
                    member_id: newState.member?.id ?? raise("member is null"),
                    action_type: newState.mute ? "muted" : "unmuted",
                  });
                }
              )
              .when(
                ([oldState, newState]) =>
                  oldState.streaming !== newState.streaming,
                async () => {
                  await Member.upsert({
                    id: newState.member!.id,
                    username: newState.member!.user.username,
                    display_name: newState.member!.displayName,
                    global_name: newState.member!.user.globalName ?? "",
                    display_avatar_url: newState.member!.user.displayAvatarURL({
                      size: 4096,
                    }),
                  });

                  // stream
                  await ChannelActivity.insert({
                    channel_id: newChannelId,
                    member_id: newState.member?.id ?? raise("member is null"),
                    action_type: newState.streaming
                      ? "stream_started"
                      : "stream_stopped",
                  });
                }
              );
          })
          .with(false, async () => {
            // move
            // check if new channel registered
            const oldChannelCommandPair = await ChannelCommandPair.get({
              channel_id: oldChannelId,
              command_id: command.id,
            });

            const newChannelCommandPair = await ChannelCommandPair.get({
              channel_id: newChannelId,
              command_id: command.id,
            });

            if (oldChannelCommandPair) {
              await Member.upsert({
                id: oldState.member!.id,
                username: oldState.member!.user.username,
                display_name: oldState.member!.displayName,
                global_name: oldState.member!.user.globalName ?? "",
                display_avatar_url: oldState.member!.user.displayAvatarURL({
                  size: 4096,
                }),
              });

              await ChannelActivity.insert({
                channel_id: oldChannelId,
                member_id: oldState.member?.id ?? raise("member is null"),
                action_type: "leave",
              });
            }

            if (newChannelCommandPair) {
              await Member.upsert({
                id: newState.member!.id,
                username: newState.member!.user.username,
                display_name: newState.member!.displayName,
                global_name: newState.member!.user.globalName ?? "",
                display_avatar_url: newState.member!.user.displayAvatarURL({
                  size: 4096,
                }),
              });

              await ChannelActivity.insert({
                channel_id: newChannelId,
                member_id: newState.member?.id ?? raise("member is null"),
                action_type: "join",
              });
            }
          })
          .exhaustive();
      })
      .exhaustive();
  })
  .on("messageCreate", async (message) => {
    const channel = await Channel.get(message.channelId);
    if (!channel) {
      return;
    }

    if (!message.member?.voice.channelId || !message?.guildId) {
      console.log("channelId or guildId is null");
      return;
    }

    if (!message.guild?.voiceAdapterCreator) {
      console.log("voiceAdapterCreator is null");
      return;
    }

    if (message.content !== "test") {
      return;
    }

    // Uint8Array to Stream
    const stream = new Stream.Readable();
    // stream.push(response.audioContent);
    stream.push(null);

    const audioResource = createAudioResource(stream);
    // await message.reply("tts!");
    const voiceConnection = joinVoiceChannel({
      channelId: message.member.voice.channelId,
      guildId: message.guildId,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const enterVoiceConnection = await entersState(
      voiceConnection,
      VoiceConnectionStatus.Connecting,
      5_000
    );

    console.log(enterVoiceConnection.state.status);

    if (enterVoiceConnection.state.status === VoiceConnectionStatus.Ready) {
      console.log("연결됨");
      enterVoiceConnection.subscribe(audioPlayer);
      audioPlayer.play(audioResource);
    }
  });

client.login(
  process.env.TOKEN ?? raise("TOKEN environment variable is required!")
);

export default client;
