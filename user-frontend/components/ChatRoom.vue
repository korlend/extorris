<template>
  <div class="chat__room">
    <div class="chat__room-messages custom__scroll">
      <div v-for="message in filteredMessages">
        {{ `${message.user_id}: ${message.message}` }}
      </div>
    </div>
    <div class="chat__room-send__row">
      <v-text-field
        class="chat__room-send__row-input"
        v-model="currentMessage"
        label="Send:"
        hide-details="auto"
        @keydown.enter="sendMessage"></v-text-field>
      <v-btn class="chat__room-send__row-button" @click="sendMessage">
        Send
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommsStore } from "~/store/comms";
import type { ChatMessage } from "~/store/chat";
import { CommsModels } from "extorris-common";

const props = defineProps({
  chatId: {
    type: Number,
    required: true,
  },
  messages: {
    type: Array<ChatMessage>,
  },
});

const commsStore = useCommsStore();

const currentMessage: Ref<string> = ref("");

onBeforeMount(() => {});

const sendMessage = () => {
  commsStore.sendMessage({
    fromWhere: CommsModels.CommsSourceEnum.USER_CLIENT,
    messageType: CommsModels.CommsTypesEnum.CHAT_CHANGE,
    data: {
      chatId: props.chatId,
      message: currentMessage.value,
    },
  });
  currentMessage.value = "";
};

const filteredMessages = computed(() => {
  return props.messages?.filter((msg) => msg.chat_id === props.chatId);
});
</script>

<style lang="scss" scoped>
.chat__room {
  display: flex;
  flex-flow: column;
  position: relative;
  height: 100%;
  justify-content: space-between;

  &-messages {
    display: flex;
    flex-flow: column;
    max-height: calc(100% - 56px);
    overflow-y: auto;
    flex-direction: column-reverse;
  }

  &-send__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 56px;

    &-input {
      width: 100%;
    }

    &-button {
      min-width: 30px;
    }
  }
}
</style>
