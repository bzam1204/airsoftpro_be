import {GameStatus} from "@/domain/entities/game";

const gameProps = {
  specificRules : undefined,
  minHonorLevel : 0,
  playerLimit : 10,
  friendlyFire : false,
  description : undefined,
  startDate : new Date(Date.now() + 1000 * 60 * 60 * 12),
  gameMode : "MilSim",
  fpsLimit : 400,
  fieldId : "123",
  status : GameStatus.SCHEDULED,
  id : "1",
};

export default gameProps