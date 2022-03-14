import {
  ActionFlags,
  Actions,
  BaseSource,
  DduItem,
  Item,
} from "https://deno.land/x/ddu_vim@v1.2.0/types.ts#^";
import { Denops } from "https://deno.land/x/ddu_vim@v1.2.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.2.0/file.ts#^";
import { getDefaultGroup, loadDirmarkData } from "../ddu_dirmark/main.ts";

type Params = { group: string | undefined };

export class Source extends BaseSource<Params> {
  kind = "file";
  currentGroup: string | undefined = undefined;

  actions: Actions<Params> = {
    remove: async (args: { denops: Denops; items: DduItem[] }) => {
      const group = this.currentGroup ?? await getDefaultGroup(args.denops);
      for (const item of args.items) {
        await args.denops.dispatch("ddu_dirmark", "remove", {
          group: group,
          name: item.word,
        });
      }
      return Promise.resolve(ActionFlags.None);
    },
  };

  gather(
    args: { denops: Denops; sourceParams: Params },
  ): ReadableStream<Item<ActionData>[]> {
    this.currentGroup = args.sourceParams["group"];
    return new ReadableStream({
      async start(controller) {
        const data = await loadDirmarkData(args.denops);
        const group = args.sourceParams["group"] ??
          await getDefaultGroup(args.denops);
        controller.enqueue(
          await Promise.all(data["group"][group]["dirmarks"].map(
            async (dirmark) => ({
              word: dirmark.name,
              display: `[${dirmark.name}] ${dirmark.path}`,
              action: { path: dirmark.path },
              highlights: [
                {
                  name: "name",
                  hl_group: "Denite_Dirmark_Name",
                  col: 1,
                  width: ((await args.denops.call(
                    "strwidth",
                    `[${dirmark.name}]`,
                  )) as number) + 1,
                },
              ],
            }),
          )),
        );

        controller.close();
      },
    });
  }

  params(): Params {
    return { "group": undefined };
  }
}
