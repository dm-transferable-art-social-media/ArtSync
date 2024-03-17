import {
  AppBskyActorDefs,
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyFeedDefs,
  AppBskyFeedLike,
  AppBskyFeedPost,
  AppBskyFeedRepost,
  AppBskyGraphFollow,
  AppBskyNotificationListNotifications,
  AppBskyRichtextFacet,
  AtpAgent,
  AtpSessionData,
} from "@atproto/api";
import { AtUri } from "@atproto/uri";

import { Overwrite } from "./well-typed";

// Re-export app.bsky entity types
export type Facet = Overwrite<
  AppBskyRichtextFacet.Main,
  [["features"], FacetFeature.Any[]]
>;
export type Entity = AppBskyFeedPost.Entity;
export type ProfileView = AppBskyActorDefs.ProfileView;
export type ProfileViewDetailed = AppBskyActorDefs.ProfileViewDetailed;
export type PostView = Overwrite<
  AppBskyFeedDefs.PostView,
  [["record"], Record.Post]
>;
export type FeedViewPost = Overwrite<
  AppBskyFeedDefs.FeedViewPost,
  [["post"], PostView]
>;
export type ReplyRef = Overwrite<
  AppBskyFeedDefs.ReplyRef,
  [["parent"], PostView],
  [["root"], PostView]
>;
export namespace FacetFeature {
  export type Any = Link | Mention;
  export type Link = AppBskyRichtextFacet.Link;
  export const isLink = AppBskyRichtextFacet.isLink;
  export type Mention = AppBskyRichtextFacet.Mention;
  export const isMention = AppBskyRichtextFacet.isMention;
}
export namespace Record {
  export type Like = AppBskyFeedLike.Record;
  export const isLike = AppBskyFeedLike.isRecord;
  export type Repost = AppBskyFeedRepost.Record;
  export const isRepost = AppBskyFeedRepost.isRecord;
  export type Follow = AppBskyGraphFollow.Record;
  export const isFollow = AppBskyGraphFollow.isRecord;
  export type Post = Overwrite<AppBskyFeedPost.Record, [["facets"], Facet[]]>;
  export const isPost = (x: unknown): x is Post => AppBskyFeedPost.isRecord(x);
}
export namespace Thread {
  export type Any = Post | NotFoundPost;
  export type Post = Overwrite<
    AppBskyFeedDefs.ThreadViewPost,
    [["post"], PostView]
  >;
  export const isPost = (x: unknown): x is Post =>
    AppBskyFeedDefs.isThreadViewPost(x);
  export type NotFoundPost = AppBskyFeedDefs.NotFoundPost;
  export const isNotFoundPost = AppBskyFeedDefs.isNotFoundPost;
}
export namespace Embed {
  export type Any =
    | Image
    | External
    | Record
    | RecordNotFound
    | RecordWithMedia;
  export type Image = AppBskyEmbedImages.View;
  export const isImage = (x: unknown): x is Image =>
    AppBskyEmbedImages.isView(x);
  export type External = AppBskyEmbedExternal.View;
  export const isExternal = (x: unknown): x is External =>
    AppBskyEmbedExternal.isView(x);
  export type Record = Overwrite<
    AppBskyEmbedRecord.View,
    [
      ["record"],
      Overwrite<
        AppBskyEmbedRecord.ViewRecord,
        [["value"], Pick<PostView, "createdAt" | "embed" | "text">]
      >
    ]
  >;
  export const isRecord = (x: unknown): x is Record =>
    AppBskyEmbedRecord.isView(x) && AppBskyEmbedRecord.isViewRecord(x.record);
  export type RecordNotFound = Overwrite<
    AppBskyEmbedRecord.View,
    [["record"], AppBskyEmbedRecord.ViewNotFound]
  >;
  export const isRecordNotFound = (x: unknown): x is RecordNotFound =>
    AppBskyEmbedRecord.isView(x) && AppBskyEmbedRecord.isViewNotFound(x.record);
  export type RecordWithMedia = AppBskyEmbedRecordWithMedia.View;
  export const isRecordWithMedia = (x: unknown): x is RecordWithMedia =>
    AppBskyEmbedRecordWithMedia.isView(x);
}
export namespace Reason {
  export type Repost = AppBskyFeedDefs.ReasonRepost;
  export const isRepost = AppBskyFeedDefs.isReasonRepost;
  export const getRepost = (x: unknown) => (isRepost(x) ? x : undefined);
}
export namespace Notification {
  export type Any = Like | Repost | Follow | Post;

  export type Like = Overwrite<
    AppBskyNotificationListNotifications.Notification,
    [["reason"], "like"],
    [["record"], Record.Like]
  >;
  export type Repost = Overwrite<
    AppBskyNotificationListNotifications.Notification,
    [["reason"], "repost"],
    [["record"], Record.Repost]
  >;
  export type Follow = Overwrite<
    AppBskyNotificationListNotifications.Notification,
    [["reason"], "follow"],
    [["record"], Record.Follow]
  >;
  export type Post = Overwrite<
    AppBskyNotificationListNotifications.Notification,
    [["reason"], "mention" | "reply" | "quote"],
    [["record"], Record.Post]
  >;
}

const SES_LOCAL_STORAGE_KEY = "sess";

export const agent = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    localStorage.setItem(SES_LOCAL_STORAGE_KEY, JSON.stringify(sess));
  },
});

let self: { did: string; handle: string } | null = null;

type CursoredResponse<T> = Promise<[data: T, cursor?: string]>;

const getCreatedAt = () => new Date().toISOString();

export const getMyHandle = () => self?.handle || "";

export const isMe = (actor: string) =>
  actor === self?.did || actor === self?.handle;

export class AtpError extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export const tryResumeSession = async () => {
  const session = (() => {
    const sessStr = localStorage.getItem(SES_LOCAL_STORAGE_KEY);
    if (!sessStr) {
      return null;
    }
    try {
      return JSON.parse(sessStr) as AtpSessionData;
    } catch {
      return null;
    }
  })();

  if (!session) {
    return { success: false };
  }

  const { success, data } = await agent.resumeSession(session);

  if (success) {
    self = data;
  }

  return { success };
};

export const createSession = async (params: {
  identifier: string;
  password: string;
}) => {
  try {
    const { success, data } = await agent.login(params);

    if (success) {
      self = data;
    }

    return { success };
  } catch {
    return { success: false };
  }
};

export const deleteSession = () => {
  localStorage.removeItem(SES_LOCAL_STORAGE_KEY);
  self = null;
};

export const getTimeline = async (params: {
  limit?: number;
  cursor?: string;
}): CursoredResponse<FeedViewPost[]> => {
  const { success, data } = await agent.api.app.bsky.feed.getTimeline({
    ...params,
    algorithm: "reverse-chronological",
  });
  if (!success) {
    throw new AtpError("getTimeline failed");
  }

  return [data.feed as FeedViewPost[], data.cursor];
};

export const getNotifications = async (): CursoredResponse<
  Notification.Any[]
> => {
  const { success, data } =
    await agent.api.app.bsky.notification.listNotifications();
  if (!success) {
    throw new AtpError("getTimeline failed");
  }

  return [data.notifications as Notification.Any[], data.cursor];
};

export const postText = async (params: {
  text: string;
  images?: { alt: string; blob: Blob }[];
  replyTo?: FeedViewPost;
}) => {
  const { text, replyTo, images = [] } = params;

  // Check if there are any images to upload
  if (images.length === 0) {
    // Create the post payload without embedded images
    const postPayload = {
      text,
      createdAt: getCreatedAt(),
      reply: replyTo
        ? {
          parent: replyTo.post,
          root: replyTo.reply?.root || replyTo.post,
        }
        : undefined,
    };

    // Send the post data to the server
    return agent.api.app.bsky.feed.post.create(
      { repo: self?.did },
      postPayload
    );
  } else {
    const imageUploads = await Promise.all(
      images.map(async (image) => {
        // Determine the MIME type of the image file
        const mimeType = image.blob.type; // This gives the MIME type of the file

        // Upload each image blob and get the reference
        const imageUpload = await agent.uploadBlob(image.blob, {
          encoding: mimeType, // Set the encoding based on the MIME type
        });
        return {
          alt: image.alt,
          ref: imageUpload.data.blob.ref, // Get the reference to the uploaded image
          mimeType: mimeType, // Set the MIME type based on the image type
          size: image.blob.size,
        };
      })
    );

    // Create the post payload with embedded images
    const postPayload = {
      text,
      embed: {
        $type: "app.bsky.embed.images",
        images: imageUploads.map((upload) => ({
          alt: upload.alt,
          image: {
            $type: "blob",
            ref: upload.ref,
            mimeType: upload.mimeType,
            size: upload.size, // You might need to handle this based on the actual blob size
          },
        })),
      },
      createdAt: getCreatedAt(),
      reply: replyTo
        ? {
          parent: replyTo.post,
          root: replyTo.reply?.root || replyTo.post,
        }
        : undefined,
    };

    // Send the post data to the server
    return agent.api.app.bsky.feed.post.create(
      { repo: self?.did },
      postPayload
    );
  }
};



export const deletePost = async (params: { uri: string }) =>
  agent.api.app.bsky.feed.post.delete({
    repo: self?.did,
    ...parseUri(params.uri),
  });

export const searchActors = async (params: {
  term: string;
}): CursoredResponse<ProfileView[]> => {
  const { success, data } = await agent.api.app.bsky.actor.searchActors(params);
  if (!success) {
    throw new AtpError("searchUsers failed");
  }

  return [data.actors, data.cursor];
};

export const follow = async (params: { did: string }) =>
  agent.api.app.bsky.graph.follow.create(
    { repo: self?.did },
    {
      subject: params.did,
      createdAt: new Date().toISOString(),
    }
  );

export const unfollow = async (params: { uri: string }) =>
  agent.api.app.bsky.graph.follow.delete({
    repo: self?.did,
    ...parseUri(params.uri),
  });

export const getProfile = async (params?: {
  // If omitted, get login user's profile
  actor?: string;
}): Promise<ProfileViewDetailed> => {
  const actor = params?.actor || self?.handle;
  if (!actor) {
    throw new AtpError();
  }

  const { success, data } = await agent.api.app.bsky.actor.getProfile({
    actor,
  });

  if (!success) {
    throw new AtpError("getProfile failed");
  }

  return data;
};

export const getFollows = async (params?: {
  // If omitted, get login user's follows
  actor?: string;
}): CursoredResponse<ProfileView[]> => {
  const actor = params?.actor || self?.handle;
  if (!actor) {
    throw new AtpError();
  }

  const { success, data } = await agent.api.app.bsky.graph.getFollows({
    actor,
  });
  if (!success) {
    throw new AtpError("getFollows failed");
  }

  return [data.follows, data.cursor];
};

export const getFollowers = async (params?: {
  // If omitted, get login user's followers
  actor?: string;
}): CursoredResponse<ProfileView[]> => {
  const actor = params?.actor || self?.handle;
  if (!actor) {
    throw new AtpError();
  }
  const { success, data } = await agent.api.app.bsky.graph.getFollowers({
    actor,
  });
  if (!success) {
    throw new AtpError("getFollowers failed");
  }

  return [data.followers, data.cursor];
};

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

export const repost = async (params: { uri: string; cid: string }) =>
  agent.api.app.bsky.feed.repost.create(
    { repo: self?.did },
    {
      subject: params,
      createdAt: getCreatedAt(),
    }
  );

export const like = async (params: { uri: string; cid: string }) =>
  agent.api.app.bsky.feed.like.create(
    { repo: self?.did },
    {
      subject: params,
      createdAt: getCreatedAt(),
    }
  );

export const getThread = async (params: {
  uri: string;
  depth?: number;
}): Promise<Thread.Any> => {
  const { success, data } = await agent.api.app.bsky.feed.getPostThread({
    ...params,
    depth: params.depth ?? 0,
  });
  if (!success) {
    throw new AtpError("getThread failed");
  }

  return data.thread as Thread.Any;
};

export const getPost = async (params: {
  uri: string;
}): Promise<PostView | null> => {
  const thread = await getThread({
    ...params,
    depth: 0,
  });
  if (Thread.isNotFoundPost(thread)) {
    return null;
  }

  return thread.post;
};

export const updateHandle = async (params: { handle: string }) =>
  agent.api.com.atproto.identity.updateHandle({ handle: params.handle });

export const parseUri = (uri: string) => {
  const aturi = new AtUri(uri);

  return {
    did: aturi.hostname,
    collection: aturi.collection,
    rkey: aturi.rkey,
  };
};

export const getCustomFeed = async (feedLink : string) =>
{
  const {success, data} = await agent.api.app.bsky.feed.getFeed({
    // example links
    // feed: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
    feed: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaaoxzvxrgczg",
    // feed: feedLink,
    limit: 22,
  });
  if (!success) {
    throw new AtpError("getCustomFeed failed");
  }
  console.log(data);
  return data;
}