const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace filters title
content = content.replace('Özellik Filtrelerinde :', 'Filtre :');

// Remove extra filter options
content = content.replace(/\{\s*key:\s*"air_conditioning"[^}]+},\s*\{\s*key:\s*"plus_thirty"[^}]+\},/g, '');

// Reorder categories
const catsRegex = /\{\/\* Category 1 \*\/\}.*?\{\/\* Vertical Divider \*\/\}/s;
const newCats = `{/* Category 1 */}
                  <button
                    onClick={() => setFilterType("all")}
                    className={\`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all \${
                      filterType === "all"
                        ? "border-stone-900 text-stone-900 font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }\`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Tüm Evler</span>
                  </button>

                  {/* Category 2 */}
                  <button
                    onClick={() => setFilterType("muhafazakar")}
                    className={\`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all \${
                      filterType === "muhafazakar"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }\`}
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span>Muhafazakar Villalar</span>
                  </button>

                  {/* Category 3 */}
                  <button
                    onClick={() => setFilterType("balayi")}
                    className={\`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all \${
                      filterType === "balayi"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }\`}
                  >
                    <Heart className="h-5 w-5 text-[#FF385C] fill-[#FF385C]" />
                    <span>Balayı Villaları</span>
                  </button>

                  {/* Category 4 */}
                  <button
                    onClick={() => setFilterType("villa")}
                    className={\`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all \${
                      filterType === "villa"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }\`}
                  >
                    <Building className="h-5 w-5" />
                    <span>Lüks Villalar</span>
                  </button>

                  {/* Category 5 */}
                  <button
                    onClick={() => setFilterType("bungalow")}
                    className={\`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all \${
                      filterType === "bungalow"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }\`}
                  >
                    <Tent className="h-5 w-5" />
                    <span>Bungalovlar</span>
                  </button>

                  {/* Category 6 */}
                  <button
                    onClick={() => setFilterType("apartment")}
                    className={\`flex flex-col items-center gap-1.5 pb-2 border-b-2 text-xs font-semibold transition-all \${
                      filterType === "apartment"
                        ? "border-stone-900 text-[#FF385C] font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-700"
                    }\`}
                  >
                    <Compass className="h-5 w-5" />
                    <span>Daireler</span>
                  </button>
                </div>

                {/* Vertical Divider */}`;

content = content.replace(catsRegex, newCats.trim() + '\n\n                {/* Vertical Divider */}');

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Done!');
