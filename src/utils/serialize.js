export function toCategory(c) {
  if (!c || !c._id) return { id: "", slug: "uncategorized", name: "News", color: "#b3121b" };
  return { id: String(c._id), slug: c.slug, name: c.name, color: c.color, order: c.order, showOnHome: c.showOnHome };
}

export function toAuthor(u) {
  if (!u || !u._id) return { id: "", slug: "staff", name: "Staff Reporter" };
  return {
    id: String(u._id),
    slug: u.slug,
    name: u.name,
    role: u.designation || undefined,
    avatar: u.avatar || undefined,
    bio: u.bio || undefined,
  };
}

export function toArticle(a, { withContent = true, admin = false } = {}) {
  const out = {
    id: String(a._id),
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImage: {
      url: a.coverImage?.url,
      alt: a.coverImage?.alt || a.title,
      caption: a.coverImage?.caption || undefined,
      credit: a.coverImage?.credit || undefined,
    },
    category: toCategory(a.category),
    author: toAuthor(a.author),
    tags: a.tags || [],
    location: a.location || undefined,
    publishedAt: (a.publishedAt || a.createdAt)?.toISOString(),
    updatedAt: a.updatedAt?.toISOString(),
    readingTime: a.readingTime || 1,
    views: a.views || 0,
    isBreaking: Boolean(a.isBreaking),
    isFeatured: Boolean(a.isFeatured),
  };
  if (withContent) {
    out.content = admin
      ? a.content || []
      : (a.content || []).map((b) =>
          b.type === "image" ? { type: "image", image: { url: b.image?.url, alt: b.image?.alt, caption: b.image?.caption, credit: b.image?.credit } } : b
        );
  }
  if (admin) {
    out.status = a.status;
    out.createdAt = a.createdAt?.toISOString();
    out.coverImage.publicId = a.coverImage?.publicId || undefined;
  }
  return out;
}

export function toUser(u) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    designation: u.designation,
    bio: u.bio,
    avatar: u.avatar,
    active: u.active,
    lastLoginAt: u.lastLoginAt?.toISOString(),
    createdAt: u.createdAt?.toISOString(),
  };
}
