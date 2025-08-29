import AdminRoleService from "@src/services/admin/AdminRoleService.js";
import AdminService from "@src/services/admin/AdminService.js";
import AdminSessionService from "@src/services/admin/AdminSessionService.js";
import ChatMessageService from "@src/services/chat/ChatMessageService.js";
import ChatService from "@src/services/chat/ChatService.js";
import ChatUserService from "@src/services/chat/ChatUserService.js";
import ConfigDimensionsService from "@src/services/ConfigDimensionsService.js";
import CountryService from "@src/services/CountryService.js";
import DungeonIslandService from "@src/services/DungeonIslandService.js";
import EntityType from "@src/enums/EntityType.js";
import ExternalCreatureService from "@src/services/main_map/ExternalCreatureService.js";
import GuildService from "@src/services/GuildService.js";
import ImageService from "@src/services/ImageService.js";
import InlandCreatureService from "@src/services/InlandCreatureService.js";
import IterationService from "@src/services/IterationService.js";
import LanguageService from "@src/services/translation/LanguageService.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import MainMapService from "@src/services/main_map/MainMapService.js";
import NestService from "@src/services/NestService.js";
import NestTypeService from "@src/services/NestTypeService.js";
import PortalService from "@src/services/main_map/PortalService.js";
import RTCalcInstanceHubService from "@src/services/rtcalc/RTCalcInstanceHubService.js";
import RTCalcInstanceService from "@src/services/rtcalc/RTCalcInstanceService.js";
import ShipArmorService from "@src/services/ship/ShipArmorService.js";
import ShipCannonService from "@src/services/ship/ShipCannonService.js";
import ShipEnergyCoreService from "@src/services/ship/ShipEnergyCoreService.js";
import ShipEngineService from "@src/services/ship/ShipEngineService.js";
import ShipHullService from "@src/services/ship/ShipHullService.js";
import ShipModuleTypeService from "@src/services/ship/ShipModuleTypeService.js";
import ShipService from "@src/services/ship/ShipService.js";
import TranslationService from "@src/services/translation/TranslationService.js";
import TreeBranchService from "@src/services/main_map/TreeBranchService.js";
import TreeService from "@src/services/main_map/TreeService.js";
import UserBeenToHubsService from "@src/services/main_map/UserBeenToHubsService.js";
import UserIslandService from "@src/services/UserIslandService.js";
import UserService from "@src/services/user/UserService.js";
import UserSessionService from "@src/services/user/UserSessionService.js";
import UserShipModuleService from "@src/services/ship/UserShipModuleService.js";

const entityServices: Record<EntityType, any> = {
  [EntityType.ADMIN]: AdminService,
  [EntityType.ADMIN_ROLE]: AdminRoleService,
  [EntityType.ADMIN_SESSION]: AdminSessionService,
  [EntityType.CHAT]: ChatService,
  [EntityType.CHAT_MESSAGE]: ChatMessageService,
  [EntityType.CHAT_USERS]: ChatUserService,
  [EntityType.CONFIG_DIMENSIONS]: ConfigDimensionsService,
  [EntityType.COUNTRY]: CountryService,
  [EntityType.DUNGEON_ISLAND]: DungeonIslandService,
  [EntityType.EXTERNAL_CREATURE]: ExternalCreatureService,
  [EntityType.GUILD]: GuildService,
  [EntityType.IMAGE]: ImageService,
  [EntityType.INLAND_CREATURE]: InlandCreatureService,
  [EntityType.ITERATION]: IterationService,
  [EntityType.LANGUAGE]: LanguageService,
  [EntityType.MAIN_MAP]: MainMapService,
  [EntityType.MAIN_MAP_HUB]: MainMapHubService,
  [EntityType.NEST]: NestService,
  [EntityType.NEST_TYPE]: NestTypeService,
  [EntityType.PORTAL]: PortalService,
  [EntityType.RTCALC_INSTANCE]: RTCalcInstanceService,
  [EntityType.RTCALC_INSTANCE_HUB]: RTCalcInstanceHubService,
  [EntityType.SHIP]: ShipService,
  [EntityType.SHIP_ARMOR]: ShipArmorService,
  [EntityType.SHIP_CANNON]: ShipCannonService,
  [EntityType.SHIP_ENERGY_CORE]: ShipEnergyCoreService,
  [EntityType.SHIP_ENGINE]: ShipEngineService,
  [EntityType.SHIP_HULL]: ShipHullService,
  [EntityType.SHIP_MODULE_TYPE]: ShipModuleTypeService,
  [EntityType.TRANSLATION]: TranslationService,
  [EntityType.TRANSLATION_LANGUAGE]: TranslationService,
  [EntityType.TREE]: TreeService,
  [EntityType.TREE_BRANCH]: TreeBranchService,
  [EntityType.USER]: UserService,
  [EntityType.USER_BEEN_TO_HUBS]: UserBeenToHubsService,
  [EntityType.USER_ISLAND]: UserIslandService,
  [EntityType.USER_SESSION]: UserSessionService,
  [EntityType.USER_SHIP_MODULE]: UserShipModuleService,
};

export default entityServices;
