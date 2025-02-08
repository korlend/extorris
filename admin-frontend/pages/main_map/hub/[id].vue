<template>
  <div class="hub">
    <client-only>
      <CanvasComponent :canvas-blocks="canvasBlocks"></CanvasComponent>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useMainMapStore } from "@/store/main_map";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import MittEvents from "~/core/enums/MittEvents";

import {
  CanvasComponent,
  CanvasCursors,
  type CanvasBlock,
  type CanvasClickEvent,
  type CanvasDrawOptions,
  type CanvasElement,
  type Vector2D,
} from "extorris-common";

const { $mittEmit } = useNuxtApp();

const router = useRouter();
const route = useRoute();
const mainMapStore = useMainMapStore();

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

const hubId: Ref<number | null | undefined> = ref(
  parseInt(route.params.id as string)
);

const hubData: Ref<Record<string, any> | null> = ref(null);

watch(
  () => route,
  async (newRoute) => {
    const newHubId = parseInt(newRoute.params.id as string);
    if (hubId.value === newHubId) {
      return;
    }
    hubId.value = newHubId;
    const data = await loadHub();
    if (data) {
      hubData.value = data;
    }
    resetCanvasBlock();
  }
);

onMounted(async () => {
  const data = await loadHub();
  if (data) {
    hubData.value = data;
  }
  resetCanvasBlock();
});

const resetCanvasBlock = (iteration?: any) => {
  canvasBlocks.value = [];
  if (!hubData.value) {
    return;
  }

  const newCanvasBlocks: Array<CanvasBlock> = [];

  console.log(hubData.value.fromPortals);
  console.log(hubData.value.toPortals);

  for (let i = 0; i < hubData.value.fromPortals.length; i++) {
    const portal = hubData.value.fromPortals[i];
    newCanvasBlocks.push({
      zindex: 1,
      position: {
        x: portal.from_hub_position_x,
        y: portal.from_hub_position_y,
      },
      fill: [
        {
          path: getHalfEllipse(300),
          color: `rgb(200,50,200)`,
        },
      ],
    });
  }

  for (let i = 0; i < hubData.value.toPortals.length; i++) {
    const portal = hubData.value.toPortals[i];
    newCanvasBlocks.push({
      zindex: 1,
      position: {
        x: portal.to_hub_position_x,
        y: portal.to_hub_position_y,
      },
      fill: [
        {
          path: getHalfEllipse(300),
          color: `rgb(200,50,200)`,
        },
      ],
    });
  }

  const max = 20000;
  const step = 500;

  for (let i = -max / 2; i <= max / 2; i += step) {
    newCanvasBlocks.push({
      stroke: [
        {
          path: getLine({ x: i, y: -max / 2 }, { x: i, y: max / 2 }),
          color: `rgb(255,255,255)`,
        },
      ],
    });
    newCanvasBlocks.push({
      stroke: [
        {
          path: getLine({ x: -max / 2, y: i }, { x: max / 2, y: i }),
          color: `rgb(255,255,255)`,
        },
      ],
    });
  }

  canvasBlocks.value = newCanvasBlocks;
};

const getHalfEllipse = (radius: number): Path2D => {
  const halfEllipse = new Path2D();
  // halfEllipse.arc(0, 0, radius, Math.PI, 0, true)
  halfEllipse.ellipse(0, 0, radius * 0.7, radius, 0, 0, Math.PI * 2);
  return halfEllipse;
};

const getLine = (start: Vector2D, end: Vector2D): Path2D => {
  const line = new Path2D();
  line.moveTo(start.x, start.y);
  line.lineTo(end.x, end.y);
  return line;
};

const loadHub = async () => {
  if (!hubId.value) {
    return;
  }
  return await mainMapStore.loadHub(hubId.value);
};
</script>

<style lang="scss" scoped>
.hub {
}
</style>
