import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix handleDeleteVilla to include API call
delete_villa_pattern = r'const handleDeleteVilla = \(id: string\) => \{\s*if \(confirm\("Bu ilanı sistemden silmek istediğinize emin misiniz\?"\)\) \{\s*const updated = villas\.filter\(\(v\) => v\.id !== id\);\s*saveVillasState\(updated\);\s*\}\s*\};'

replacement_delete_villa = """const handleDeleteVilla = async (id: string) => {
    const updated = villas.filter((v) => v.id !== id);
    saveVillasState(updated);
    try {
      await fetch(`/api/villas/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete villa from API", e);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean | undefined) => {
    const nextStatus = currentStatus === false ? true : false;
    const updated = villas.map(v => v.id === id ? { ...v, isActive: nextStatus } : v);
    saveVillasState(updated);
    try {
      await fetch(`/api/villas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus })
      });
    } catch (e) {
      console.error("Failed to toggle villa active status", e);
    }
  };"""

content = re.sub(delete_villa_pattern, replacement_delete_villa, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("DONE SCRIPT")
