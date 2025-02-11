<template>
  <div class="chat__block" :class="{ hidden: !showChat }" :style="styles">
    <div
      class="chat__block-hide__button"
      :class="{ hidden: !showChat }"
      @click="toggleChat">
    </div>
    <div class="chat__block-select__chat custom-scroll">
      <span
        class="chat__block-select__chat-item"
        :class="{ selected: chat.id === currentChat?.id }"
        v-for="chat in userChats"
        @click="selectChat(chat)">
        {{ chat.id }}
      </span>
    </div>
    <ChatRoom
      v-if="currentChat"
      :chat-id="currentChat?.id"
      :messages="messages"></ChatRoom>
  </div>
</template>

<script setup lang="ts">
import { useChatStore, type UserChat } from "~/store/chat";
import { useAuthStore } from "~/store/auth";
import { useCommsStore } from "~/store/comms";
import { CommsModels } from "extorris-common";

const chatStore = useChatStore();
const authStore = useAuthStore();
const commsStore = useCommsStore();

const chatHeight = 250;
const chatWidth = 500;

const currentChat: Ref<UserChat | null> = ref(null);

const showChat: Ref<boolean> = ref(true);

let commsCallbackId: string | undefined;

onMounted(() => {
  authStore.addPostAuthCallback(async () => {
    const response = await chatStore.reloadChatRooms();
    if (response.userChats.length) {
      currentChat.value = response.userChats[0];
    }
  });
  commsCallbackId = commsStore.addOnMessage(chatStore.receiveNewMessage);
});

onBeforeUnmount(() => {
  commsStore.removeOnMessage(commsCallbackId);
});

const userChats = computed(() => {
  return chatStore.getUserChats;
});

const messages = computed(() => {
  return chatStore.getMessages;
});

const styles = computed(() => {
  return {
    "--width": `${chatWidth}px`,
    "--height": `${chatHeight}px`,
  };
});

const selectChat = (chat: UserChat) => {
  currentChat.value = chat;
};

const toggleChat = () => {
  showChat.value = !showChat.value;
};
</script>

<style lang="scss" scoped>
@use "sass:map" as map;
@use "~/assets/styles/variables" as vars;

.chat__block {
  position: fixed;
  left: 20px;
  bottom: 100px;
  z-index: map.get(vars.$z-indices, "chat");
  width: var(--width);
  height: var(--height);
  border: 1px solid white;
  backdrop-filter: blur(10px);
  transition: left 0.2s ease;

  &.hidden {
    left: calc(-1 * var(--width));
  }

  &-hide__button {
    position: absolute;
    top: 0;
    left: -21px;
    height: 100%;
    width: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
    opacity: 0.3;
    transition: opacity 0.2s ease;

    &.hidden {
      left: unset;
      right: -21px;

      &::after {
        content: ">";
      }
    }

    &:hover {
      opacity: 0.7;
    }

    &::after {
      content: "<";
    }
  }

  &-select__chat {
    position: absolute;
    top: -25px;
    left: -1px;
    width: 100%;
    display: flex;
    flex-flow: row;
    z-index: 101;

    &-item {
      border-top: 1px solid white;
      border-right: 1px solid white;
      border-left: 1px solid white;
      border-bottom: 1px solid white;
      background: #333;
      min-width: 50px;
      height: 25px;
      padding: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.selected {
        border-bottom: none;
      }
    }
  }
}
</style>
