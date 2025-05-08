<template>
  <div class="hub">
    <div class="hub-controls">
      <span class="hub-controls-angle">
        <v-slider
          v-model="angleSlider"
          :min="0"
          :max="360"
          label="Angle"
          hide-details
          @update:model-value="sendInstructions">
          <template v-slot:append>
            <v-text-field
              v-model="angleSlider"
              density="compact"
              style="width: 80px"
              type="number"
              hide-details
              single-line
              @update:model-value="sendInstructions"></v-text-field>
          </template>
        </v-slider>
      </span>
      <span class="hub-controls-speed">
        <v-slider
          v-model="speedSlider"
          :min="0"
          :max="maxSpeed"
          label="Speed"
          hide-details
          @update:model-value="sendInstructions">
          <template v-slot:append>
            <v-text-field
              v-model="speedSlider"
              density="compact"
              style="width: 80px"
              type="number"
              hide-details
              single-line
              @update:model-value="sendInstructions"></v-text-field>
          </template>
        </v-slider>
      </span>
    </div>
    <client-only>
      <CanvasComponent :canvas-blocks="canvasBlocks"></CanvasComponent>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import {
  CanvasComponent,
  CanvasCursors,
  CommsModels,
  throttle,
  type CanvasBlock,
  type Vector2D,
} from "extorris-common";
import { useCommsStore } from "~/store/comms";
import { useHubStore } from "~/store/hub";
import { useShipStore } from "~/store/ship";

const router = useRouter();
const route = useRoute("hub-id");

interface LocalPortal {
  toHubId: number;
  x: number;
  y: number;
}

const hubStore = useHubStore();
const shipStore = useShipStore();
const commsStore = useCommsStore();

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

const shipImage = new Image();

let commsCallbackId: string;

const maxSpeed = 100;

const speedSlider: Ref<number> = ref(0);
const angleSlider: Ref<number> = ref(0);

const shipsInHub: Ref<Array<{
  id: number;
  speed: number;
  angle: number;
  hp: number;
  x: number;
  y: number;
}> | null> = ref(null);

onMounted(async () => {
  shipImage.src = "/default_ship.png";
  await shipStore.loadShipInfo();

  if (hubId.value !== getCurrentHub.value?.id) {
    await hubStore.loadHub(hubId.value);
  }

  if (getCurrentHub.value?.id) {
    commsStore.sendMessage({
      fromWhere: CommsModels.CommsSourceEnum.USER_CLIENT,
      messageType: CommsModels.CommsTypesEnum.HUB_SUBSCRIBE,
      data: {
        hubId: getCurrentHub.value?.id,
      },
    });

    commsCallbackId = commsStore.addOnMessage((message) => {
      if (
        message.messageType === CommsModels.CommsTypesEnum.SHIP_POSITION_CHANGE
      ) {
        console.log(message.data)
        const data = message.data;
        shipsInHub.value = data.ships;
        let ship;
        if (
          ship = data.ships.find((v) => v.id === currentUserShip.value.id)
        ) {
          // angleSlider.value = ship.angle;
          // speedSlider.value = ship.speed;
        }
        resetCanvasBlock();
      }
    });
  }

  // route params still might be not equal to current hub id
  // because user can input custom hub id, which will be unaccessible to them
  // in that case, load hub will return their ship, if it's in flight or otherwise userIsland hub
  if (getCurrentHub.value?.id && hubId.value !== getCurrentHub.value?.id) {
    router.replace({
      name: "hub-id",
      params: {
        id: getCurrentHub.value?.id,
      },
    });
  }
  resetCanvasBlock();
});

onBeforeUnmount(() => {
  if (commsCallbackId) {
    commsStore.removeOnMessage(commsCallbackId);
  }
});

const hubId = computed(() => {
  return parseInt(route.params.id);
});

const currentUserShip = computed(() => {
  return shipStore.getUserShip;
});

const getPortals = computed(() => {
  return hubStore.getPortals;
});

const getCurrentHub = computed(() => {
  return hubStore.getCurrentHub;
});

const getUsersIslands = computed(() => {
  return hubStore.getUsersIslands;
});

const getLocalPortals = computed((): Array<LocalPortal> => {
  const portals = getPortals.value;
  const localPortals: Array<LocalPortal> = [];
  const currentHubId = getCurrentHub.value?.id;
  for (let i = 0; i < portals.length; i++) {
    const portal = portals[i];
    if (portal.from_hub_id === currentHubId) {
      localPortals.push({
        x: portal.from_hub_position_x,
        y: portal.from_hub_position_y,
        toHubId: portal.to_hub_id,
      });
      continue;
    }
    if (portal.to_hub_id === currentHubId) {
      localPortals.push({
        x: portal.to_hub_position_x,
        y: portal.to_hub_position_y,
        toHubId: portal.from_hub_id,
      });
    }
  }
  return localPortals;
});

const sendInstructions = throttle(() => {
  commsStore.sendMessage({
    fromWhere: CommsModels.CommsSourceEnum.USER_CLIENT,
    messageType: CommsModels.CommsTypesEnum.SHIP_POSITION_CHANGE,
    data: {
      angle: angleSlider.value,
      speed: speedSlider.value,
    },
  });
}, 20);

const resetCanvasBlock = () => {
  canvasBlocks.value = [];
  if (!getCurrentHub.value) {
    return;
  }

  const newCanvasBlocks: Array<CanvasBlock> = [];

  const hubId = getCurrentHub.value?.id;
  if (!hubId) {
    return;
  }

  const localPortals = getLocalPortals.value;

  // ship
  if (shipImage.complete && shipsInHub.value) {
    for (let i = 0; i < shipsInHub.value.length; i++) {
      const ship = shipsInHub.value[i];
      const { width, height } = shipImage;
      const path2d = getRectangle(width, height);
      newCanvasBlocks.push({
        zindex: 99, // above all
        position: {
          x: ship.x,
          y: ship.y,
        },
        fill: [
          {
            path: {
              image: shipImage,
              width: -width / 2,
              height: -height / 2,
            },
            // path: path2d,
            rotate: ship.angle,
            // color: `rgb(50,50,200)`,
          },
        ],
        hoverWhen: [path2d],
        hoverChange: {
          cursor: CanvasCursors.POINTER,
        },
        clickCallback: () => {
          console.log("ship clicked: ", ship);
        },
      });
    }
  }

  // portals
  for (let i = 0; i < localPortals.length; i++) {
    const portal = localPortals[i];
    const path2d = getPortalEllipse(300);
    newCanvasBlocks.push({
      zindex: 1, // above grid
      position: {
        x: portal.x,
        y: portal.y,
      },
      fill: [
        {
          path: path2d,
          color: `rgb(200,50,200)`,
        },
      ],
      hoverWhen: [path2d],
      hoverChange: {
        cursor: CanvasCursors.POINTER,
      },
      clickCallback: () => {
        router.replace({
          name: "hub-id",
          params: {
            id: portal.toHubId,
          },
        });
      },
    });
  }

  // users islands
  for (let i = 0; i < getUsersIslands.value.length; i++) {
    const userIsland = getUsersIslands.value[i];
    const path2d = getIslandEllipse(300);
    newCanvasBlocks.push({
      zindex: 2, // above grid and portal
      position: {
        x: userIsland.hub_pos_x,
        y: userIsland.hub_pos_y,
      },
      fill: [
        {
          path: path2d,
          color: `rgb(50,200,50)`,
        },
      ],
      hoverWhen: [path2d],
      hoverChange: {
        cursor: CanvasCursors.POINTER,
      },
      clickCallback: () => {
        console.log("hub of user: ", userIsland.user_id);
        if (userIsland.user_id === currentUserShip.value.id) {
          router.push({
            name: "index",
          });
        }
      },
    });
  }

  const max = 20000;
  const step = 500;

  // background grid
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

const getPortalEllipse = (radius: number): Path2D => {
  const halfEllipse = new Path2D();
  halfEllipse.ellipse(0, 0, radius * 0.7, radius, 0, 0, Math.PI * 2);
  return halfEllipse;
};

const getIslandEllipse = (radius: number): Path2D => {
  const halfEllipse = new Path2D();
  halfEllipse.ellipse(0, 0, radius, radius * 0.7, 0, 0, Math.PI * 2);
  return halfEllipse;
};

const getLine = (start: Vector2D, end: Vector2D): Path2D => {
  const line = new Path2D();
  line.moveTo(start.x, start.y);
  line.lineTo(end.x, end.y);
  return line;
};

const getRectangle = (width: number, height: number): Path2D => {
  const line = new Path2D();
  line.moveTo(-width / 2, height / 2);
  line.lineTo(width / 2, height / 2);
  line.lineTo(width / 2, -height / 2);
  line.lineTo(-width / 2, -height / 2);
  return line;
};
</script>

<style lang="scss" scoped>
.hub {
  &-controls {
    position: fixed;
    z-index: 10;
    bottom: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &-angle {
      width: 20%;
    }

    &-speed {
      width: 20%;
    }
  }
}
</style>
