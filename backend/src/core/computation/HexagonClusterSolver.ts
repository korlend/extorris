import { MainMapHubModel, PortalModel } from "@src/models/db/index.js";
import { randomInt, randomUUID } from "crypto";
import {
  getDepthItemMaxNumber,
  getHexesDirection,
  getHexNearbyCoords,
  getReverseDirection,
  HexDirection,
  randomCheck,
} from "extorris-common";

class TempPortal {
  _tempId: number | string = randomUUID();
  portal: PortalModel = new PortalModel();
}

class HubClusterItem {
  depth: number;
  hubNumber: number;

  links: Record<HexDirection, HubClusterItem | null> = {
    topLeft: null,
    topRight: null,
    right: null,
    bottomRight: null,
    bottomLeft: null,
    left: null,
  };

  hubIdMappedItems: Record<number, HubClusterItem> = {};

  constructor(
    hub: MainMapHubModel,
    hubIdMappedItems: Record<number, HubClusterItem> = {},
  ) {
    this.depth = hub.on_depth;
    this.hubNumber = hub.hub_number;
    this.hubIdMappedItems = hubIdMappedItems;
    this.hubIdMappedItems[hub.id] = this;
  }
}

export default class HexagonClusterSolver {
  private portalPositions: Record<HexDirection, { x: number; y: number }> = {
    [HexDirection.TOP_LEFT]: { x: -4000, y: 4000 },
    [HexDirection.TOP_RIGHT]: { x: 4000, y: 4000 },
    [HexDirection.RIGHT]: { x: 6000, y: 0 },
    [HexDirection.BOTTOM_RIGHT]: { x: 4000, y: -4000 },
    [HexDirection.BOTTOM_LEFT]: { x: -4000, y: -4000 },
    [HexDirection.LEFT]: { x: -6000, y: 0 },
  };

  private hubs: Array<MainMapHubModel> = [];
  private mappedHubsById: Record<number, MainMapHubModel> = {};
  private portals: Array<TempPortal> = [];
  private mappedHubsByDepth: Record<number, Record<number, MainMapHubModel>> =
    {};
  private mappedPortalsHubId: Record<number, Array<TempPortal>> = {}; // [{hub_id}]: Array<TempPortal>
  private mappedPortalsFromTo: Record<number, Record<number, TempPortal>> = {}; // [{from_hub_id}][{to_hub_id}]: TempPortal

  constructor(hubs: Array<MainMapHubModel>, portals: Array<PortalModel> = []) {
    this.hubs = hubs;
    for (let i = 0; i < portals.length; i++) {
      this.addPortal(portals[i]);
    }
    this.mapHubs(this.hubs);
  }

  private mapHubs(hubs: Array<MainMapHubModel>) {
    for (let i = 0; i < hubs.length; i++) {
      const hub = hubs[i];
      this.mappedHubsById[hub.id] = hub;
      if (!this.mappedHubsByDepth[hub.on_depth]) {
        this.mappedHubsByDepth[hub.on_depth] = {};
      }
      this.mappedHubsByDepth[hub.on_depth][hub.hub_number] = hub;
    }
  }

  private mapPortals(hubs: Array<MainMapHubModel>) {
    const mappedHubs: Record<number, Record<number, MainMapHubModel>> = {};
    for (let i = 0; i < hubs.length; i++) {
      const hub = hubs[i];
      if (!mappedHubs[hub.on_depth]) {
        mappedHubs[hub.on_depth] = {};
      }
      mappedHubs[hub.on_depth][hub.hub_number] = hub;
    }
    return mappedHubs;
  }

  private addPortal(portal: PortalModel) {
    const tempPortal = new TempPortal();
    tempPortal.portal = portal;
    this.portals.push(tempPortal);
  }

  private addMapPortal(tempPortal: TempPortal) {
    if (!tempPortal.portal.from_hub_id || !tempPortal.portal.to_hub_id) {
      throw new Error("addMappedPortal error, no hub id on portal");
    }

    const fromHub = this.mappedHubsById[tempPortal.portal.from_hub_id];
    const toHub = this.mappedHubsById[tempPortal.portal.to_hub_id];

    // mapping portals by from and to hub id
    if (!this.mappedPortalsFromTo[fromHub.id]) {
      this.mappedPortalsFromTo[fromHub.id] = { [toHub.id]: tempPortal };
    } else {
      this.mappedPortalsFromTo[fromHub.id][toHub.id] = tempPortal;
    }
    if (!this.mappedPortalsFromTo[toHub.id]) {
      this.mappedPortalsFromTo[toHub.id] = { [fromHub.id]: tempPortal };
    } else {
      this.mappedPortalsFromTo[toHub.id][fromHub.id] = tempPortal;
    }

    // mapping portals as array by hub id
    if (!this.mappedPortalsHubId[fromHub.id]) {
      this.mappedPortalsHubId[fromHub.id] = [tempPortal];
    } else {
      this.mappedPortalsHubId[fromHub.id].push(tempPortal);
    }
    if (!this.mappedPortalsHubId[toHub.id]) {
      this.mappedPortalsHubId[toHub.id] = [tempPortal];
    } else {
      this.mappedPortalsHubId[toHub.id].push(tempPortal);
    }
  }

  private initialPortalCreation() {
    for (let i = 0; i < this.hubs.length; i++) {
      const hub = this.hubs[i];
      const fromDepth = hub.on_depth;
      const fromHubNumber = hub.hub_number;
      const directions = Object.values(HexDirection) as Array<HexDirection>;
      const coordinates = getHexNearbyCoords(fromDepth, fromHubNumber);
      for (let j = 0; j < directions.length; j++) {
        const direction = directions[j];
        const reverseDirection = getReverseDirection(direction);

        const checks = randomCheck(1, 5);
        if (!checks) {
          continue;
        }

        const toHubCoords = coordinates[direction];
        const toHub: MainMapHubModel | undefined =
          this.mappedHubsByDepth[toHubCoords.itemDepth]?.[
            toHubCoords.itemNumber
          ];

        // if portal destination exists
        if (!toHub) {
          continue;
        }

        // check if portal already exists between two hubs
        if (this.mappedPortalsFromTo[hub.id]?.[toHub.id]) {
          continue;
        }

        const fromHubId = hub.id;
        const toHubId = toHub.id;

        /* creating new portal start */
        let tempPortal = new TempPortal();
        tempPortal.portal.from_hub_id = fromHubId;
        tempPortal.portal.to_hub_id = toHubId;

        const fromPositions = this.portalPositions[direction];
        const toPositions = this.portalPositions[reverseDirection];

        tempPortal.portal.from_hub_position_x = fromPositions.x;
        tempPortal.portal.from_hub_position_y = fromPositions.y;
        tempPortal.portal.to_hub_position_x = toPositions.x;
        tempPortal.portal.to_hub_position_y = toPositions.y;

        this.portals.push(tempPortal);
        /* creating new hub end */

        this.addMapPortal(tempPortal);
      }
    }
  }

  private connectingEmptyHubs() {
    for (let i = 0; i < this.hubs.length; i++) {
      const hub = this.hubs[i];
      const portals = this.mappedPortalsHubId[hub.id] || [];

      // skip if there are already portals in hub
      if (portals.length) {
        continue;
      }

      const nearbyHubsCoords = getHexNearbyCoords(hub.on_depth, hub.hub_number);
      const nearbyHubs: Array<MainMapHubModel> = [];
      const coordsKeys = Object.values(HexDirection) as Array<HexDirection>;
      for (let i = 0; i < coordsKeys.length; i++) {
        const key = coordsKeys[i];
        const coords = nearbyHubsCoords[key];
        const toHub =
          this.mappedHubsByDepth[coords.itemDepth]?.[coords.itemNumber];
        if (toHub) {
          nearbyHubs.push(toHub);
        }
      }

      const nearbyHubIndexSelection = randomInt(nearbyHubs.length - 1);
      const connectToHub = nearbyHubs[nearbyHubIndexSelection];

      const direction = getHexesDirection(
        hub.on_depth,
        hub.hub_number,
        connectToHub.on_depth,
        connectToHub.hub_number,
      );

      if (!direction) {
        throw new Error("couldn't get direction between hexagons");
      }

      const reverseDirection = getReverseDirection(direction);

      const fromHubId = hub.id;
      const toHubId = connectToHub.id;

      /* creating new portal start */
      let tempPortal = new TempPortal();
      tempPortal.portal.from_hub_id = fromHubId;
      tempPortal.portal.to_hub_id = toHubId;

      const fromPositions = this.portalPositions[direction];
      const toPositions = this.portalPositions[reverseDirection];

      tempPortal.portal.from_hub_position_x = fromPositions.x;
      tempPortal.portal.from_hub_position_y = fromPositions.y;
      tempPortal.portal.to_hub_position_x = toPositions.x;
      tempPortal.portal.to_hub_position_y = toPositions.y;

      this.portals.push(tempPortal);
      /* creating new hub end */

      this.addMapPortal(tempPortal);
    }
  }

  private formingClusters(): Array<HubClusterItem> {
    const clusters: Array<HubClusterItem> = [];
    for (let i = 0; i < this.hubs.length; i++) {
      const hub = this.hubs[i];
      if (clusters.some((cluster) => cluster.hubIdMappedItems[hub.id])) {
        continue;
      }
      clusters.push(this.recursiveClusterFill(hub));
    }
    return clusters;
  }

  private recursiveClusterFill(
    hub: MainMapHubModel,
    hubClusterItem: HubClusterItem | null = null,
  ): HubClusterItem {
    const directions = Object.values(HexDirection) as Array<HexDirection>;
    const nearbyCoordinates = getHexNearbyCoords(hub.on_depth, hub.hub_number);

    if (!hubClusterItem) {
      hubClusterItem = new HubClusterItem(hub, {});
    }

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const nearbyCoordinate = nearbyCoordinates[direction];
      const nearbyDepth = nearbyCoordinate.itemDepth;
      const nearbyNumber = nearbyCoordinate.itemNumber;
      const nearbyHub = this.mappedHubsByDepth[nearbyDepth]?.[nearbyNumber];

      // hub doesn't exist
      if (!nearbyHub) {
        continue;
      }

      // hubs aren't connected by portal
      if (!this.mappedPortalsFromTo[hub.id]?.[nearbyHub.id]) {
        continue;
      }

      // if hub isn't already mapped by recursion
      if (!hubClusterItem.hubIdMappedItems[nearbyHub.id]) {
        const newClusterItem = new HubClusterItem(
          nearbyHub,
          hubClusterItem.hubIdMappedItems,
        );
        hubClusterItem.links[direction] = newClusterItem;

        this.recursiveClusterFill(nearbyHub, newClusterItem);
      }
    }

    return hubClusterItem;
  }

  private findFirstClusterConnection(cluster: HubClusterItem): {
    fromHubId: number;
    toHubId: number;
    direction: HexDirection;
    reverseDirection: HexDirection;
  } | null {
    const clusterHubIds: Array<number> = Object.keys(
      cluster.hubIdMappedItems,
    ).map(Number);
    for (let i = 0; i < clusterHubIds.length; i++) {
      const hubId = clusterHubIds[i];
      const hub = this.mappedHubsById[hubId];
      const directions = Object.values(HexDirection) as Array<HexDirection>;
      const nearbyCoordinates = getHexNearbyCoords(
        hub.on_depth,
        hub.hub_number,
      );

      for (let j = 0; j < directions.length; j++) {
        const direction = directions[j];
        const nearbyCoordinate = nearbyCoordinates[direction];
        const nearbyDepth = nearbyCoordinate.itemDepth;
        const nearbyNumber = nearbyCoordinate.itemNumber;
        const nearbyHub = this.mappedHubsByDepth[nearbyDepth]?.[nearbyNumber];

        // hub doesn't exist
        if (!nearbyHub) {
          continue;
        }

        // hub in the same cluster
        if (clusterHubIds.includes(nearbyHub.id)) {
          continue;
        }

        return {
          fromHubId: hub.id,
          toHubId: nearbyHub.id,
          direction: direction,
          reverseDirection: getReverseDirection(direction),
        };
      }
    }

    return null;
  }

  private findAndConnectHubsClusters() {
    const clusters = this.formingClusters();
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const connection = this.findFirstClusterConnection(cluster);

      if (!connection) {
        continue; // should be impossible
      }

      const { fromHubId, toHubId, direction, reverseDirection } = connection;

      /* creating new portal start */
      let tempPortal = new TempPortal();
      tempPortal.portal.from_hub_id = fromHubId;
      tempPortal.portal.to_hub_id = toHubId;

      const fromPositions = this.portalPositions[direction];
      const toPositions = this.portalPositions[reverseDirection];

      tempPortal.portal.from_hub_position_x = fromPositions.x;
      tempPortal.portal.from_hub_position_y = fromPositions.y;
      tempPortal.portal.to_hub_position_x = toPositions.x;
      tempPortal.portal.to_hub_position_y = toPositions.y;

      this.portals.push(tempPortal);
      /* creating new hub end */

      this.addMapPortal(tempPortal);
    }
  }

  // creating portals, "simple" or "usual" generation
  generateSimplePortals(): Array<PortalModel> {
    this.initialPortalCreation();
    this.connectingEmptyHubs();
    this.findAndConnectHubsClusters();

    const clusters = this.formingClusters()
    if (clusters.length) {
      this.findAndConnectHubsClusters();
    }

    return this.portals.map((v) => v.portal);
  }
}
