"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function GalleryAdminPage() {
  const photos = useQuery(api.gallery.list) ?? [];
  const add = useMutation(api.gallery.add);
  const remove = useMutation(api.gallery.remove);
  const generateUploadUrl = useMutation(api.gallery.generateUploadUrl);
  const [caption, setCaption] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    await add({ storageId, caption: caption || undefined, order: photos.length });
    setCaption("");
    e.target.value = "";
  }

  return (
    <div>
      <h1>Gallery</h1>
      <div style={{ margin: "16px 0", display: "flex", gap: 8, alignItems: "center" }}>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" />
        <input type="file" accept="image/*" onChange={onUpload} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {photos.map((p: any) => (
          <div key={p._id} style={{ width: 160 }}>
            {p.url && <img src={p.url} alt={p.caption ?? ""} style={{ width: "100%", borderRadius: 6 }} />}
            <button onClick={() => remove({ id: p._id })} style={{ marginTop: 4 }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
