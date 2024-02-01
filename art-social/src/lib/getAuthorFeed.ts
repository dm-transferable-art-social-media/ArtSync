import {
    AppBskyFeedDefs,
 
  } from "@atproto/api";
  import { AtUri } from "@atproto/uri";
  
  import { Overwrite } from "./well-typed";
import {FeedViewPost, AtpError} from "../lib/bsky";

import {agent} from "../lib/bsky.ts"
let self: { did: string; handle: string } | null = null;

type CursoredResponse<T> = Promise<[data: T, cursor?: string]>;


export const getAuthorFeed = async (params?: {
    // If omitted, get login user's feed
    actor?: string;
  }): CursoredResponse<FeedViewPost[]> => {
    const actor = params?.actor || self?.handle;
    if (!actor) {
      throw new AtpError();
    }
  
    const { success, data } = await agent.api.app.bsky.feed.getAuthorFeed({
      actor,
    });
    if (!success) {
      throw new AtpError("getAuthorFeed failed");
    }
  
    return [data.feed as FeedViewPost[], data.cursor];
  };