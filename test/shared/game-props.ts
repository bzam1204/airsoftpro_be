import GameStatus from "@/domain/enums/game-status";

const gameProps = {
  specificRules : undefined,
  minHonorLevel : 0,
  playersLimit : 10,
  friendlyFire : false,
  description : undefined,
  startDate : new Date(Date.now() + 1000 * 60 * 60 * 12),
  gameMode : "MilSim",
  fpsLimit : 400,
  fieldId : "1",
  status : GameStatus.SCHEDULED,
  id : "1",
};

export default gameProps;
