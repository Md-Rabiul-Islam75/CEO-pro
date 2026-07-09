"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_PRODUCTS,
  withProductsDefaults,
  type Product,
} from "@/lib/pages/products";

let pid = 0;
const uid = () => `p-${Date.now().toString(36)}-${pid++}`;

export default function ProductsEditor() {
  const [banner, setBanner] = useState(DEFAULT_PRODUCTS.banner);
  const [items, setItems] = useState<Product[]>(DEFAULT_PRODUCTS.products);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/products");

  useEffect(() => {
    fetch("/api/pages/products")
      .then((r) => r.json())
      .then((d) => {
        const c = withProductsDefaults(d);
        setBanner(c.banner);
        setItems(c.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (id: string, field: keyof Product, value: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, products: items }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <EditorHeader
        title="Edit: Products & Platforms"
        description="A banner, then a grid of product cards (image · name · category · description · link)."
        viewHref="/products"
        onSave={save}
        saving={saving}
        saved={saved}
        status={ps.status}
        onStatusChange={ps.change}
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <BlockCard label="Banner">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <div className="space-y-4">
                <Field label="Headline" value={banner.headline} onChange={(v) => setBanner((b) => ({ ...b, headline: v }))} />
                <Field label="Intro" textarea value={banner.intro} onChange={(v) => setBanner((b) => ({ ...b, intro: v }))} />
              </div>
            </div>
          </BlockCard>

          <BlockCard label="Products" hint="drag to reorder">
            <SortableList
              ids={items.map((p) => p.id)}
              onReorder={(ids) =>
                setItems((xs) => {
                  const by = new Map(xs.map((x) => [x.id, x]));
                  return ids.map((i) => by.get(i)!).filter(Boolean);
                })
              }
            >
              <div className="space-y-3">
                {items.map((p) => (
                  <SortableItem key={p.id} id={p.id}>
                    {({ setNodeRef, style, handleProps, isDragging }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        className={`flex gap-4 rounded-lg border border-line bg-white p-4 ${
                          isDragging ? "shadow-lg ring-1 ring-brand-blue-soft" : ""
                        }`}
                      >
                        <button {...handleProps} className="mt-1 h-fit cursor-grab touch-none rounded p-1 text-ink-faint hover:bg-slate-100 active:cursor-grabbing" aria-label="Drag">
                          <AdminIcon name="grip" className="h-4 w-4" />
                        </button>
                        <ImageField value={p.image} onChange={(v) => set(p.id, "image", v)} label="Image" boxClass="h-20 w-28" />
                        <div className="grid flex-1 gap-3 sm:grid-cols-2">
                          <Field label="Name" value={p.name} onChange={(v) => set(p.id, "name", v)} />
                          <Field label="Category" value={p.category} onChange={(v) => set(p.id, "category", v)} />
                          <div className="sm:col-span-2">
                            <Field label="Description" textarea value={p.description} onChange={(v) => set(p.id, "description", v)} />
                          </div>
                          <Field label="Link" value={p.link} placeholder="https://…" onChange={(v) => set(p.id, "link", v)} className="sm:col-span-2" />
                        </div>
                        <button type="button" onClick={() => setItems((xs) => xs.filter((x) => x.id !== p.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove product">
                          <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableList>

            <button
              type="button"
              onClick={() => setItems((xs) => [...xs, { id: uid(), image: "", name: "New product", category: "", description: "", link: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" />
              Add product
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
