"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import Card from "@/components/ui/Card";
import { Plus, Edit2, Check, X, User } from "lucide-react";

interface Specialist {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  specialty: string;
  bio: string;
  isBlocked: boolean;
}

const EMPTY = { firstName: "", lastName: "", phone: "", specialty: "", bio: "" };

export default function AdminSpecialists() {
  const router = useRouter();
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ firstName: "", lastName: "", specialty: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/admin/specialists")
      .then((r) => { if (r.status === 401) { router.push("/admin/login"); return null; } return r.json(); })
      .then((d) => { if (d) setSpecialists(d.specialists); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    if (!form.firstName.trim()) { setError("First name is required"); return; }
    if (!form.phone.trim()) { setError("Phone is required"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/specialists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setAdding(false); setForm(EMPTY); load(); }
    else { const d = await res.json(); setError(d.error || "Failed"); }
    setSaving(false);
  };

  const saveEdit = async (id: number) => {
    setSaving(true);
    await fetch(`/api/admin/specialists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    setEditing(null);
    load();
    setSaving(false);
  };

  const toggleBlock = async (s: Specialist) => {
    await fetch(`/api/admin/specialists/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !s.isBlocked }),
    });
    load();
  };

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="Specialists" />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 4 }}>Specialists</h1>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>
              {specialists.filter(s => !s.isBlocked).length} active
            </p>
          </div>
          <button onClick={() => { setAdding(true); setError(""); }} className="btn-primary btn-rect" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Plus size={14} /> Add specialist
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <Card padding="md" style={{ marginBottom: 16, border: "1.5px solid var(--color-ink)" }}>
            <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 14 }}>New specialist</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>First name *</label>
                <input value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="e.g. Amara" autoFocus style={{ width: "100%", fontFamily: "var(--font-body)" }} />
              </div>
              <div>
                <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Last name</label>
                <input value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="e.g. Wanjiku" style={{ width: "100%", fontFamily: "var(--font-body)" }} />
              </div>
              <div>
                <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Phone *</label>
                <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07XX XXX XXX" style={{ width: "100%", fontFamily: "var(--font-body)" }} />
              </div>
              <div>
                <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Specialty</label>
                <input value={form.specialty} onChange={(e) => setForm(f => ({ ...f, specialty: e.target.value }))} placeholder="e.g. Facials & Waxing" style={{ width: "100%", fontFamily: "var(--font-body)" }} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Bio (shown to clients)</label>
              <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short intro about this specialist..." rows={2} style={{ width: "100%", fontFamily: "var(--font-body)", resize: "vertical" }} />
            </div>
            {error && <p style={{ fontSize: "var(--text-caption)", color: "#dc2626", marginBottom: 10 }}>{error}</p>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={add} disabled={saving} className="btn-primary btn-rect" style={{ fontSize: 13 }}>
                {saving ? "Saving…" : "Add specialist"}
              </button>
              <button onClick={() => { setAdding(false); setForm(EMPTY); setError(""); }} style={{ fontSize: 13, padding: "7px 14px", border: "1px solid var(--color-silver)", borderRadius: 8, background: "white", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Cancel
              </button>
            </div>
          </Card>
        )}

        {loading ? (
          <p style={{ color: "var(--color-slate)", fontSize: "var(--text-body-sm)" }}>Loading…</p>
        ) : specialists.length === 0 ? (
          <Card padding="md" style={{ textAlign: "center" }}>
            <User size={32} color="var(--color-stone)" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>No specialists yet. Add one above to get started.</p>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {specialists.map((s) => (
              <Card key={s.id} padding="md" style={{ opacity: s.isBlocked ? 0.55 : 1 }}>
                {editing === s.id ? (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 3 }}>First name</label>
                        <input value={editDraft.firstName} onChange={(e) => setEditDraft(d => ({ ...d, firstName: e.target.value }))} style={{ width: "100%", fontFamily: "var(--font-body)" }} autoFocus />
                      </div>
                      <div>
                        <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 3 }}>Last name</label>
                        <input value={editDraft.lastName} onChange={(e) => setEditDraft(d => ({ ...d, lastName: e.target.value }))} style={{ width: "100%", fontFamily: "var(--font-body)" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 3 }}>Specialty</label>
                        <input value={editDraft.specialty} onChange={(e) => setEditDraft(d => ({ ...d, specialty: e.target.value }))} style={{ width: "100%", fontFamily: "var(--font-body)" }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 3 }}>Bio</label>
                      <textarea value={editDraft.bio} onChange={(e) => setEditDraft(d => ({ ...d, bio: e.target.value }))} rows={2} style={{ width: "100%", fontFamily: "var(--font-body)", resize: "vertical" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => saveEdit(s.id)} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "6px 14px", background: "var(--color-ink)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        <Check size={13} /> Save
                      </button>
                      <button onClick={() => setEditing(null)} style={{ fontSize: 13, padding: "6px 12px", border: "1px solid var(--color-silver)", borderRadius: 8, background: "white", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, flexShrink: 0 }}>
                      {initials(s.name || "?")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 2 }}>
                        {s.name} {s.isBlocked && <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 400 }}>· Inactive</span>}
                      </p>
                      {s.specialty && <p style={{ fontSize: "var(--text-caption)", color: "var(--color-ink)", marginBottom: 2 }}>{s.specialty}</p>}
                      {s.bio && <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{s.bio}</p>}
                      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", marginTop: 2 }}>{s.phone}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setEditing(s.id); setEditDraft({ firstName: s.firstName || "", lastName: s.lastName || "", specialty: s.specialty, bio: s.bio }); }} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Edit2 size={13} color="var(--color-slate)" />
                      </button>
                      <button onClick={() => toggleBlock(s)} style={{ fontSize: 12, padding: "6px 12px", border: "1px solid var(--color-silver)", borderRadius: 8, background: "white", cursor: "pointer", fontFamily: "var(--font-body)", color: s.isBlocked ? "var(--color-ink)" : "#dc2626" }}>
                        {s.isBlocked ? "Activate" : "Deactivate"}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
