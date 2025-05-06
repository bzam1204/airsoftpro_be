import {v4} from "uuid";

import IdGenerator from "@/domain/services/id-generator";

export default class UUIDGenerator implements IdGenerator {

  generate() {
    return v4()
  };

};
