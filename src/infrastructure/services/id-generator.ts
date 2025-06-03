import {v4} from "uuid";

import IdGenerator from "@/application/services/id-generator";
import {injectable} from "tsyringe";

@injectable()
export default class UUIDGenerator implements IdGenerator {

  generate() {
    return v4()
  };

};
