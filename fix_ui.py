import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Hızlı Test Hesabı (from <div className="bg-stone-50... to </div> above form)
test_hesabi_pattern = r'\{\/\* Demo Fill Helper \*\/\}\s*<div className=\"bg-stone-50.*?</div>\s*</div>'
text = re.sub(test_hesabi_pattern, '</div>', text, flags=re.DOTALL)

# 2. Remove Admin login from modal headers
admin_header_pattern = r'\{activeLoginPopup === \"admin\" && \"Sistem Yöneticisi Girişi\"\}'
text = re.sub(admin_header_pattern, '', text)

# 3. Remove admin button in modal
admin_btn_pattern = r'\{activeLoginPopup === \"admin\" && \(\s*<button.*?</button>\s*\)\}'
text = re.sub(admin_btn_pattern, '', text, flags=re.DOTALL)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav_text = f.read()

# Remove Admin Session Options from Navbar
admin_nav_pattern = r'\{\/\* Admin Session Options \*\/\}.*?(?=\{\/\* Clear All active sessions \*\/\})'
nav_text = re.sub(admin_nav_pattern, '', nav_text, flags=re.DOTALL)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav_text)

print('Replaced')
