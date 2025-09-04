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
  Vector2D,
  CanvasComponent,
  CanvasCursors,
  CommsModels,
  throttle,
  type CanvasBlock,
  ConfigDimensionsTypes,
  HubEventTypes,
} from "extorris-common";
import { useCommsStore } from "~/store/comms";
import { useConfigStore } from "~/store/config";
import { useHubStore } from "~/store/hub";
import { useShipStore } from "~/store/ship";

const emit = defineEmits<{
  (e: "update:hub-id", hubId: number): void;
}>();

const router = useRouter();
const route = useRoute("hub-id");

interface LocalPortal {
  toHubId: number;
  x: number;
  y: number;
}

const props = defineProps({
  hubId: {
    type: Number,
    required: true,
  },
});

const configStore = useConfigStore();
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

  if (props.hubId !== getCurrentHub.value?.id) {
    await hubStore.loadHub(props.hubId);
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
      switch (message.messageType) {
        case CommsModels.CommsTypesEnum.SHIP_POSITION_CHANGE: {
          // console.log(message.data);
          const data = message.data;
          shipsInHub.value = data.ships;
          let ship;
          if (
            (ship = data.ships.find((v) => v.id === currentUserShip.value.id))
          ) {
            // angleSlider.value = ship.angle;
            // speedSlider.value = ship.speed;
          }
          resetCanvasBlock();
          break;
        }
        case CommsModels.CommsTypesEnum.HUB_EVENT: {
          const data = message.data;
          switch (data.type) {
            case HubEventTypes.USER_CHANGED_HUB: {
              switchHub(data.newHubId);
              break;
            }
          }
          break;
        }
      }
    });
  }

  // route params still might be not equal to current hub id
  // because user can input custom hub id, which will be unaccessible to them
  // in that case, load hub will return their ship, if it's in flight or otherwise userIsland hub
  if (getCurrentHub.value?.id && props.hubId !== getCurrentHub.value?.id) {
    emit("update:hub-id", getCurrentHub.value?.id);
  }
  resetCanvasBlock();
});

onBeforeUnmount(() => {
  if (commsCallbackId) {
    commsStore.removeOnMessage(commsCallbackId);
  }
});

const dimensionsConfig = computed(() => {
  return configStore.getDimensions;
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
  const dimensions = dimensionsConfig.value;
  // console.log("dimensions", dimensions);
  if (!getCurrentHub.value || !dimensions) {
    return;
  }

  const shipCollisionRadius =
    dimensions[ConfigDimensionsTypes.SHIP_HOVER_RADIUS];
  const shipWidth = dimensions[ConfigDimensionsTypes.SHIP_DISPLAY_X];
  const shipHeight = dimensions[ConfigDimensionsTypes.SHIP_DISPLAY_Y];
  const portalWidth = dimensions[ConfigDimensionsTypes.PORTAL_DISPLAY_X];
  const portalHeight = dimensions[ConfigDimensionsTypes.PORTAL_DISPLAY_Y];
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
      const shipCollisionPath = getEllipse(
        shipCollisionRadius,
        shipCollisionRadius
      );
      newCanvasBlocks.push({
        zindex: 99, // above everything
        position: new Vector2D(ship.x, ship.y),
        fill: [
          {
            path: {
              image: shipImage,
              width: shipWidth,
              height: shipHeight,
            },
            // path: path2d,
            rotate: ship.angle,
            // color: `rgb(50,50,200)`,
          },
        ],
        hoverWhen: [shipCollisionPath],
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

    const portalPath = getEllipse(portalWidth, portalHeight);
    newCanvasBlocks.push({
      zindex: 1, // above grid
      position: new Vector2D(portal.x, portal.y),
      fill: [
        {
          path: portalPath,
          color: `rgb(200,50,200)`,
        },
      ],
      hoverWhen: [portalPath],
      hoverChange: {
        cursor: CanvasCursors.POINTER,
      },
      clickCallback: () => {
        switchHub(portal.toHubId);
      },
    });
  }

  // users islands
  for (let i = 0; i < getUsersIslands.value.length; i++) {
    const userIsland = getUsersIslands.value[i];
    const path2d = getEllipse(300, 300 * 0.7);
    newCanvasBlocks.push({
      zindex: 2, // above grid and portal
      position: new Vector2D(userIsland.hub_pos_x, userIsland.hub_pos_y),
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
          path: getLine(new Vector2D(i, -max / 2), new Vector2D(i, max / 2)),
          color: `rgb(255,255,255)`,
        },
      ],
    });
    newCanvasBlocks.push({
      stroke: [
        {
          path: getLine(new Vector2D(-max / 2, i), new Vector2D(max / 2, i)),
          color: `rgb(255,255,255)`,
        },
      ],
    });
  }

  canvasBlocks.value = newCanvasBlocks;
};

const switchHub = (hubId: number) => {
  router.replace({
    name: "hub-id",
    params: {
      id: hubId,
    },
  });
};

const getEllipse = (xRadius: number, yRadius: number): Path2D => {
  const halfEllipse = new Path2D();
  halfEllipse.ellipse(0, 0, xRadius, yRadius, 0, 0, Math.PI * 2);
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
  width: 100%;
  height: 100%;

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
