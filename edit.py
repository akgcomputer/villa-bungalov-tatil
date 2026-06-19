import re
import sys

def main():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. FIND CMS BLOCK
    cms_start = content.find("{/* ⚡ MAJESTIC SUPER ADMIN CMS SITE EDITOR ⚡ */}")
    if cms_start == -1:
        print("CMS block not found!")
        sys.exit(1)
    
    grid_start = content.find('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">', cms_start)
    if grid_start == -1:
        print("Grid start not found!")
        sys.exit(1)
    
    cms_block = content[cms_start:grid_start]
    
    # Remove CMS block from its current position
    content = content[:cms_start] + content[grid_start:]
    
    # 2. CHANGE GRID TO FLEX-COL
    content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">', '<div className="flex flex-col space-y-8">')
    
    # 3. FIX REZERVASYON BOX
    content = content.replace('<div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">', '<div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">')
    content = content.replace('Küresel Rezervasyon Onay Kuyruğu (Admin Yetkisi)', 'Rezervasyon Onay Kuyruğu')
    
    # 4. REMOVE space-y-6 div
    content = content.replace('<div className="space-y-6">', '')
    # The matching closing div is right before the end of grid!
    # Wait, the closing div for space-y-6 is right before the grid's closing div!
    # Grid ends with:
    #             </div>
    #           </div>
    #         </main>
    #       )}
    
    # Let's replace the last two </div> with one </div> before </main>
    content = content.replace('            </div>\n          </div>\n        </main>', '          </div>\n        </main>')

    # 5. INSERT CMS BLOCK AFTER İLAN ONAY OR ANASAYFA VİTRİN
    # Let's find Social Channels and put CMS right above it!
    social_start = content.find("{/* Social Channels and Direct Support Management Panel */}")
    if social_start == -1:
        print("Social start not found!")
        sys.exit(1)
        
    content = content[:social_start] + cms_block + "\n              " + content[social_start:]
    
    # 6. FIX AddVillaModal to include hostId and approvalStatus
    add_villa_pattern = re.compile(
        r'onSave=\{\(newVilla\) => \{\s*const updated = \[newVilla, \.\.\.villas\];\s*saveVillasState\(updated\);\s*setShowAddVillaModal\(false\);\s*\}\}'
    )
    replacement = """onSave={async (newVilla) => {
            const villaWithHost = { 
               ...newVilla, 
               hostId: currentHost?.id,
               hostName: currentHost?.name.replace(" (Bungalov Sahibi)", ""),
               approvalStatus: "pending" 
            };
            const updated = [villaWithHost, ...villas];
            saveVillasState(updated);
            try {
               await fetch('/api/villas', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(villaWithHost)
               });
            } catch (err) {}
            setShowAddVillaModal(false);
          }}"""
          
    content = add_villa_pattern.sub(replacement, content)
    
    with open("src/App.tsx", "w", encoding="utf-8") as f:
        f.write(content)
        
    print("DONE SCRIPT!")

if __name__ == "__main__":
    main()
