import re

def main():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # We need to extract the blocks using regex or string splitting.
    # The Admin section starts at:
    # {/* Admin Platform Metrics */}
    
    # 4 Kutu Block
    # from {/* Admin Platform Metrics */}
    # to {/* ⚡ MAJESTIC SUPER ADMIN CMS SITE EDITOR ⚡ */}
    metrics_start = content.find("{/* Admin Platform Metrics */}")
    cms_start = content.find("{/* ⚡ MAJESTIC SUPER ADMIN CMS SITE EDITOR ⚡ */}")
    
    block_metrics = content[metrics_start:cms_start]
    
    grid_start = content.find("<div className=\"grid grid-cols-1 lg:grid-cols-3 gap-8\">", cms_start)
    block_cms = content[cms_start:grid_start]
    
    rez_start = content.find("{/* Global Reservation queue system for Admin */}", grid_start)
    admin_actions_start = content.find("{/* Quick Admin Actions & Platform state control */}", rez_start)
    
    block_rez = content[rez_start:admin_actions_start]
    # replace lg:col-span-2 and title
    block_rez = block_rez.replace("lg:col-span-2 ", "")
    block_rez = block_rez.replace("Küresel Rezervasyon Onay Kuyruğu (Admin Yetkisi)", "Rezervasyon Onay Kuyruğu")
    
    ilan_onay_start = content.find("{/* İlan Onay ve Vitrin Yönetimi Panel */}", admin_actions_start)
    anasayfa_start = content.find("{/* Slogan and Image Customization Panel */}", ilan_onay_start)
    iletisim_start = content.find("{/* Social Channels and Direct Support Management Panel */}", anasayfa_start)
    yonetici_start = content.find("Yönetici Tanılama ve Tesis Ekleme", iletisim_start)
    # yonetici block goes until the end of the admin section which is closing main
    # Wait, the closing of grid is:
    #           </div>
    #         </main>
    #       )}
    end_main = content.find("</main>", yonetici_start)
    # The actual yonetici block starts earlier:
    yonetici_actual_start = content.rfind("<div className=\"bg-white p-6 rounded-3xl border border-stone-200 shadow-xs\">", iletisim_start, yonetici_start)
    
    block_ilan = content[ilan_onay_start:anasayfa_start]
    block_anasayfa = content[anasayfa_start:iletisim_start]
    block_iletisim = content[iletisim_start:yonetici_actual_start]
    
    # yonetici ends with:
    #               </div>
    #             </div>
    #           </div>
    #         </main>
    # Let's just find the closing tags of grid.
    yonetici_end = content.find("          </div>\n        </main>", yonetici_actual_start)
    
    # We need to remove 1 closing div for the `space-y-6`
    # Actually, we can just grab everything we need and rebuild it!
    block_yonetici = content[yonetici_actual_start:yonetici_end]
    
    # Let's clean up block_yonetici, we just want the div itself
    # it ends with:
    #                 </div>
    #               </div>
    #               </div>
    #             </div>
    
    # To be safe, let's rebuild the whole admin body.
    
    new_admin_body = f"""{block_metrics}
          <div className="space-y-8 flex flex-col">
            {block_rez}
            {block_ilan}
            {block_cms}
            {block_iletisim}
            {block_yonetici}
          </div>
"""
    
    # Now replace the entire admin content from metrics_start to yonetici_end
    new_content = content[:metrics_start] + new_admin_body + content[yonetici_end:]
    
    with open("src/App.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print("DONE!")

if __name__ == "__main__":
    main()
