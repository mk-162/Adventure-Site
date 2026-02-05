import { db } from "@/db";
import { outreachCampaigns, operators } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function CampaignsPage() {
  const campaigns = await db.select().from(outreachCampaigns).orderBy(desc(outreachCampaigns.createdAt));
  const allOperators = await db.select({ id: operators.id, name: operators.name }).from(operators).limit(100);

  async function createCampaign(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const bodyTemplate = formData.get("bodyTemplate") as string;
    // Handle multiple select
    const operatorIds = formData.getAll("operatorIds").map(id => parseInt(id as string));

    if (!name || !subject) return;

    // Create campaign logic (just saving for now)
    const [campaign] = await db.insert(outreachCampaigns).values({
        siteId: 1, // Default site
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        subject,
        bodyTemplate,
        status: "draft"
    }).returning();

    // In a real implementation we would create recipients here
    // console.log("Created campaign", campaign.id, "with operators", operatorIds);

    revalidatePath("/admin/campaigns");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Outreach Campaigns</h1>

      {/* List */}
      <div className="grid gap-4 mb-8">
        {campaigns.length === 0 && <p className="text-gray-500">No campaigns yet.</p>}
        {campaigns.map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow border">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        <p className="text-sm text-gray-500">{c.subject}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded capitalize ${c.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.status}</span>
                </div>
                <div className="flex gap-6 mt-4 text-sm text-gray-600 border-t pt-2">
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">{c.sentCount || 0}</span>
                        <span className="text-xs uppercase">Sent</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">{c.openedCount || 0}</span>
                        <span className="text-xs uppercase">Opened ({c.sentCount ? Math.round((c.openedCount || 0) / c.sentCount * 100) : 0}%)</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">{c.clickedCount || 0}</span>
                        <span className="text-xs uppercase">Clicked ({c.openedCount ? Math.round((c.clickedCount || 0) / c.openedCount * 100) : 0}%)</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">{c.claimedCount || 0}</span>
                        <span className="text-xs uppercase">Claimed</span>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Create Form */}
      <div className="bg-white p-6 rounded shadow border max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
        <form action={createCampaign} className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-1">Campaign Name</label>
                <input name="name" className="w-full border p-2 rounded" required placeholder="e.g. Summer Outreach 2024" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Email Subject</label>
                <input name="subject" className="w-full border p-2 rounded" required placeholder="Claim your listing on Adventure Wales" />
            </div>
             <div>
                <label className="block text-sm font-bold mb-1">Body Template (HTML)</label>
                <textarea name="bodyTemplate" className="w-full border p-2 rounded h-32 font-mono text-sm" placeholder="<p>Hi {{name}}, ...</p>" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Recipients (Operators)</label>
                <select name="operatorIds" multiple className="w-full border p-2 rounded h-32">
                    {allOperators.map(op => (
                        <option key={op.id} value={op.id}>{op.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple operators</p>
            </div>
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded transition-colors">
                Create Draft
            </button>
        </form>
      </div>
    </div>
  );
}
