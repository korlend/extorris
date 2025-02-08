import EntityType from "@src/enums/EntityType.js";
import CountryModel from "@src/models/db/CountryModel.js";
import DungeonIslandModel from "@src/models/db/DungeonIslandModel.js";
import GuildModel from "@src/models/db/GuildModel.js";
import ImageModel from "@src/models/db/ImageModel.js";
import {
  AdminModel,
  AdminRoleModel,
  AdminSessionModel,
  ExternalCreatureModel,
  LanguageModel,
  MainMapModel,
  MainMapHubModel,
  PortalModel,
  ShipModel,
  ShipModuleTypeModel,
  ShipPartTypeModel,
  ShipPartSubtypeModel,
  TranslationModel,
  TranslationLanguageModel,
  TreeModel,
  TreeBranchModel,
  UserModel,
  UserSessionModel,
  UserShipModuleModel,
  UserShipPartModel,
  UserBeenToHubsModel,
  ShipArmorModel,
  ShipCannonModel,
  ShipEngineModel,
  ShipHullModel,
  ShipEnergyCoreModel,
  ChatModel,
  ChatUserModel,
  ChatMessageModel,
} from "@src/models/db/index.js";
import InlandCreatureModel from "@src/models/db/InlandCreatureModel.js";
import IterationModel from "@src/models/db/IterationModel.js";
import NestModel from "@src/models/db/NestModel.js";
import NestTypeModel from "@src/models/db/NestTypeModel.js";
import UserIslandModel from "@src/models/db/UserIslandModel.js";

const entityModels: Record<EntityType, any> = {
  [EntityType.ADMIN]: AdminModel,
  [EntityType.ADMIN_ROLE]: AdminRoleModel,
  [EntityType.ADMIN_SESSION]: AdminSessionModel,
  [EntityType.CHAT]: ChatModel,
  [EntityType.CHAT_MESSAGE]: ChatMessageModel,
  [EntityType.CHAT_USERS]: ChatUserModel,
  [EntityType.COUNTRY]: CountryModel,
  [EntityType.DUNGEON_ISLAND]: DungeonIslandModel,
  [EntityType.EXTERNAL_CREATURE]: ExternalCreatureModel,
  [EntityType.GUILD]: GuildModel,
  [EntityType.INLAND_CREATURE]: InlandCreatureModel,
  [EntityType.IMAGE]: ImageModel,
  [EntityType.ITERATION]: IterationModel,
  [EntityType.LANGUAGE]: LanguageModel,
  [EntityType.MAIN_MAP]: MainMapModel,
  [EntityType.MAIN_MAP_HUB]: MainMapHubModel,
  [EntityType.NEST]: NestModel,
  [EntityType.NEST_TYPE]: NestTypeModel,
  [EntityType.PORTAL]: PortalModel,
  [EntityType.SHIP]: ShipModel,
  [EntityType.SHIP_ARMOR]: ShipArmorModel,
  [EntityType.SHIP_CANNON]: ShipCannonModel,
  [EntityType.SHIP_ENGINE]: ShipEngineModel,
  [EntityType.SHIP_ENERGY_CORE]: ShipEnergyCoreModel,
  [EntityType.SHIP_HULL]: ShipHullModel,
  [EntityType.SHIP_MODULE_TYPE]: ShipModuleTypeModel,
  [EntityType.SHIP_PART_TYPE]: ShipPartTypeModel,
  [EntityType.SHIP_PART_SUBTYPE]: ShipPartSubtypeModel,
  [EntityType.TRANSLATION]: TranslationModel,
  [EntityType.TRANSLATION_LANGUAGE]: TranslationLanguageModel,
  [EntityType.TREE]: TreeModel,
  [EntityType.TREE_BRANCH]: TreeBranchModel,
  [EntityType.USER]: UserModel,
  [EntityType.USER_ISLAND]: UserIslandModel,
  [EntityType.USER_SESSION]: UserSessionModel,
  [EntityType.USER_SHIP_MODULE]: UserShipModuleModel,
  [EntityType.USER_SHIP_PART]: UserShipPartModel,
  [EntityType.USER_BEEN_TO_HUBS]: UserBeenToHubsModel,
};

export default entityModels;
