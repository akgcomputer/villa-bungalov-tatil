import re

def main():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update useEffect for Villas to fetch from API
    # Find the useEffect block for villas.
    load_villas_pattern = re.compile(
        r'(// 1\. Villas load\n\s*const savedVillas = localStorage\.getItem\("airbnb_villas"\);)'
    )
    
    # We will replace it with an async load inside useEffect. Wait, useEffect itself is not async, so we define a function inside.
    # Currently it's:
    #     // 1. Villas load
    #     const savedVillas = localStorage.getItem("airbnb_villas");
    #     if (savedVillas) {
    # ...
    
    # Actually, let's find the whole useEffect block starting around line 752.
    use_effect_start = content.find("  // Load state from localStorage on Mount\n  useEffect(() => {")
    if use_effect_start != -1:
        # We want to replace the Villas load part
        villas_load_start = content.find("    // 1. Villas load", use_effect_start)
        bookings_load_start = content.find("    // 2. Bookings load", villas_load_start)
        
        if villas_load_start != -1 and bookings_load_start != -1:
            new_villas_load = """    // 1. Villas load
    const loadVillas = async () => {
      try {
        const response = await fetch('/api/villas');
        if (response.ok) {
          const apiVillas = await response.json();
          setVillas(apiVillas);
          localStorage.setItem("airbnb_villas", JSON.stringify(apiVillas));
          return;
        }
      } catch (err) {
        console.error("API fetch error", err);
      }
      
      const savedVillas = localStorage.getItem("airbnb_villas");
      if (savedVillas) {
        try {
          setVillas(JSON.parse(savedVillas));
        } catch (e) {
          setVillas(VILLA_DATA);
        }
      } else {
        setVillas(VILLA_DATA);
        localStorage.setItem("airbnb_villas", JSON.stringify(VILLA_DATA));
      }
    };
    loadVillas();

"""
            content = content[:villas_load_start] + new_villas_load + content[bookings_load_start:]
    
    # 2. Add handleToggleActive function
    # Let's add it right below handleDeleteVilla
    handle_delete_idx = content.find("const handleDeleteVilla = async (id: string) => {")
    if handle_delete_idx != -1:
        # find the end of handleDeleteVilla
        end_of_delete = content.find("  };", handle_delete_idx) + 4
        
        toggle_func = """
  const handleToggleActive = async (id: string, currentStatus: boolean | undefined) => {
    const newStatus = currentStatus === false ? true : false;
    const updatedList = villas.map(v => v.id === id ? { ...v, isActive: newStatus } : v);
    saveVillasState(updatedList);
    try {
      const villaToUpdate = updatedList.find(v => v.id === id);
      if (villaToUpdate) {
        await fetch(`/api/villas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(villaToUpdate)
        });
      }
    } catch(err) {
      console.error(err);
    }
  };
"""
        content = content[:end_of_delete] + toggle_func + content[end_of_delete:]
        
    # 3. Update "İlanı Kapat" to "İlanı Sil" and add "İlanı Durdur"
    # Search for:
    #                         <button
    #                           onClick={() => handleDeleteVilla(v.id)}
    #                           className="bg-rose-50 hover:bg-[#FF385C] text-[#FF385C] hover:text-white rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 border border-rose-100"
    #                         >
    #                           İlanı Kapat
    #                         </button>
    
    target_btn = """                        <button
                          onClick={() => handleDeleteVilla(v.id)}
                          className="bg-rose-50 hover:bg-[#FF385C] text-[#FF385C] hover:text-white rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 border border-rose-100"
                        >
                          İlanı Kapat
                        </button>"""
                        
    replacement_btns = """                        <button
                          onClick={() => handleToggleActive(v.id, v.isActive)}
                          className="bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-700 rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          {v.isActive === false ? '▶ İlanı Başlat' : '⏸ İlanı Durdur'}
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm('İlanı tamamen silmek istediğinize emin misiniz?')) {
                              handleDeleteVilla(v.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-[#FF385C] text-[#FF385C] hover:text-white rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer shrink-0 border border-rose-100"
                        >
                          🗑 İlanı Sil
                        </button>"""
    
    content = content.replace(target_btn, replacement_btns)
    
    # 4. Filter active villas on guest side.
    # On the guest UI, it maps over filteredVillas.
    # Where does filteredVillas come from?
    # It probably is `const filteredVillas = villas.filter(v => ...)`
    filtered_villas_match = re.search(r'const filteredVillas = villas\.filter\(\(villa\) => \{', content)
    if filtered_villas_match:
        idx = filtered_villas_match.end()
        # insert `if (villa.isActive === false) return false;`
        content = content[:idx] + "\n    if (villa.isActive === false) return false;" + content[idx:]
        
    with open("src/App.tsx", "w", encoding="utf-8") as f:
        f.write(content)
        
    print("DONE SCRIPT!")

if __name__ == "__main__":
    main()
