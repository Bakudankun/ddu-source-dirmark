import { Denops } from "https://deno.land/x/denops_std@v3.1.4/mod.ts";
import { ensureObject } from "https://deno.land/x/unknownutil@v2.0.0/mod.ts";

type Dirmark = {
  name: string;
  path: string;
};

type DirmarkData = {
  version: string;
  group: {
    [key: string]: { name: string; dirmarks: Dirmark[] };
  };
};

export function main(denops: Denops) {
  denops.dispatcher = {
    async add(args: unknown): Promise<unknown> {
      ensureObject(args);
      const { group, name, path } = args as {
        group: string;
        name: string;
        path: string;
      };
      const data = await loadDirmarkData(denops);
      if (!data.group[group]) {
        data.group[group] = { name: group, dirmarks: [] };
      }
      data.group[group].dirmarks.push({ name, path });
      await saveDirmarkData(denops, data);

      return await Promise.resolve(args);
    },

    async remove(args: unknown): Promise<unknown> {
      ensureObject(args);
      const { group, name } = args as {
        group: string;
        name: string;
      };
      const data = await loadDirmarkData(denops);
      if (!data.group[group]) {
        return;
      }
      const dirmark = data.group[group].dirmarks.find(
        (d) => d.name === name,
      );
      if (!dirmark) {
        return;
      }
      data.group[group].dirmarks = data.group[group].dirmarks.filter(
        (d) => d !== dirmark,
      );
      await saveDirmarkData(denops, data);

      return await Promise.resolve(args);
    },
  };
}

export async function getDefaultGroup(denops: Denops): Promise<string> {
  return (await denops.call("dirmark#get_default_group")) as string;
}

async function getDataFilePath(denops: Denops): Promise<string> {
  return (await denops.call("dirmark#get_data_file_path")) as string;
}

export async function loadDirmarkData(denops: Denops): Promise<DirmarkData> {
  try {
    const txt = await Deno.readFile(await getDataFilePath(denops));
    return JSON.parse(new TextDecoder("utf-8").decode(txt)) as DirmarkData;
  } catch (_e) {
    return {
      version: "0.1.0",
      group: {},
    };
  }
}

async function saveDirmarkData(
  denops: Denops,
  data: DirmarkData,
): Promise<void> {
  for (const group of Object.values(data.group)) {
    group.dirmarks.sort((a, b) => a.name.localeCompare(b.name));
  }
  await Deno.writeFile(
    await getDataFilePath(denops),
    new TextEncoder().encode(JSON.stringify(data, undefined, 2)),
  );
}
