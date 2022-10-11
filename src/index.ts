import { launchBot } from "./bot";
import { launchDB } from "./database";

const main = async() => {
    await launchDB();
    await launchBot();
}

main()