<template>
  <div class="global__alerts">
    <div class="global__alerts-internal">
      <template
        v-for="(internalAlert, index) in internalLocalAlerts"
        :key="internalAlert.localAlert.uuid">
        <div
          class="global__alerts-internal-alert"
          :class="{
            disabled: !internalAlert.enabled,
            enabled: internalAlert.enabled && !internalAlert.inFirstAnimation,
          }"
          :style="getLocalAlertStyle(index, internalAlert)">
          <v-alert
            :title="internalAlert.localAlert.title"
            :text="internalAlert.localAlert.text" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ILocalAlert {
  localAlert: LocalAlert;
  enabled: boolean;
  inFirstAnimation: boolean;
  withTitle: boolean;
}

import { useLocalAlertsStore } from "@/store/local_alerts";
import type LocalAlert from "~/core/models/local_alerts/LocalAlert";

const step = 10;
const localAlertHeight = 100;
const localAlertTitleHeight = 30;
// in seconds
const animationTime = 0.5;

const localAlertsStore = useLocalAlertsStore();

let interval: ReturnType<typeof setTimeout>;
const internalLocalAlerts: Ref<Array<ILocalAlert>> = ref([]);

// { [uuid]: [Timeout] }
const removeTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

onMounted(() => {
  interval = setInterval(() => {
    const newInternalLocalAlerts: Array<ILocalAlert> = [];
    const currentDate = new Date();
    // for (let i = 0; i < localAlerts.value.length; i++) {
    for (let i = localAlerts.value.length - 1; i >= 0; i--) {
      const localAlert = localAlerts.value[i];

      const enabled = localAlert.end_date
        ? localAlert.end_date > currentDate
        : false;

      newInternalLocalAlerts.push({
        localAlert,
        enabled,
        inFirstAnimation:
          localAlert.start_date.getTime() + animationTime * 1000 >
          currentDate.getTime(),
        withTitle: !!localAlert.title,
      });

      if (!enabled && !removeTimeouts[localAlert.uuid]) {
        removeTimeouts[localAlert.uuid] = setTimeout(() => {
          localAlertsStore.removeAlert(localAlert.uuid);
          clearTimeout(removeTimeouts[localAlert.uuid]);
          delete removeTimeouts[localAlert.uuid];
        }, animationTime * 1000);
      }
    }
    internalLocalAlerts.value = newInternalLocalAlerts;
  }, 50);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});

const localAlerts = computed((): Array<LocalAlert> => {
  return localAlertsStore.getAlerts;
});

const getLocalAlertStyle = (index: number, internalAlert: ILocalAlert) => {
  let height = localAlertHeight;
  if (!internalAlert.withTitle) {
    height -= localAlertTitleHeight;
  }
  const bottomCalc = height * index + step * index + step;
  return {
    "--step": `${step}px`,
    "--bottom": `${bottomCalc}px`,
    "--initial-bottom": `-${height * 2}px`,
    "--height": `${height}px`,
    "--animation-time": `${animationTime}s`,
  };
};
</script>

<style lang="scss" scoped>
@use "sass:map" as map;
@use "~/assets/styles/variables" as vars;

.global__alerts {
  position: fixed;
  z-index: map.get(vars.$z-indices, "local_alerts");
  right: 0;
  bottom: 0;
  display: block;
  margin: 20px;

  &-internal {
    position: relative;
    display: flex;
    flex-direction: column-reverse;

    &-alert {
      position: absolute;
      transition: all var(--animation-time);
      // padding-bottom: 100px;
      // bottom: -calc(var(--height) + var(--step));
      bottom: var(--initial-bottom);
      right: 0px;
      width: 300px;
      height: var(--height);

      &.disabled {
        right: -350px;
        bottom: var(--bottom);
      }

      &.enabled {
        bottom: var(--bottom);
      }
    }
  }
}
</style>
