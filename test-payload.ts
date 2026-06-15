import { getPayload } from "payload";
import configPromise from "./src/payload.config.ts";

async function run() {
  const payload = await getPayload({ config: configPromise });
  const docs = await payload.find({ collection: 'posts', limit: 1, sort: '-date' });
  console.log(docs.docs[0].content);
  process.exit(0);
}
run();
