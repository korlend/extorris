export default interface ShipData {
  id: number;
  user_id: number;
  armor: {
    defense: number,
  },
  cannons: Array<{
    attack_power: number,
    energy_consumption_per_action: number,
    action_cooldown: number,
  }>,
  energyCore: {
    energy_capacity: number,
    energy_production: number,
  },
  engine: {
    max_speed: number,
    acceleration: number,
    energy_consumption: number,
  },
  hull: {
    energy_consumption_factor: number,
    maximum_crew: number,
    speed_factor: number,
    health_points: number,
    cannon_slots: number,
  },
}
