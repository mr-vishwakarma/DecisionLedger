import os

base = r'c:\Users\shyam\OneDrive\Desktop\DecisionLedger_Ram\DecisionLedger\frontend\src\features\settings\sections'
sections = [
    'WorkspaceSettings', 'GovernanceSettings', 'SecuritySettings', 
    'PermissionsSettings', 'TeamsSettings', 'AISettings', 
    'IntegrationsSettings', 'AutomationSettings', 'AnalyticsSettings', 
    'AdvancedSettings', 'SystemSettings'
]

for section in sections:
    content = f'''import React from "react";
import {{ motion }} from "framer-motion";

export default function {section}() {{
  return (
    <motion.div
      initial={{{{ opacity: 0, y: 10 }}}}
      animate={{{{ opacity: 1, y: 0 }}}}
      exit={{{{ opacity: 0 }}}}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8 border-b border-outline-variant/30 pb-4">
        <div>
          <h2 className="text-2xl font-geist font-bold text-on-surface">{section.replace('Settings', '')} Configuration</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage {section.replace('Settings', '').lower()} preferences and policies.</p>
        </div>
      </div>
      
      <div className="glass-card p-8 rounded-xl border border-outline-variant/30 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary/40 mb-4 block">construction</span>
          <h3 className="text-lg font-bold text-on-surface mb-2">Under Construction</h3>
          <p className="text-sm text-on-surface-variant">This module is currently being provisioned.</p>
        </div>
      </div>
    </motion.div>
  );
}}
'''
    with open(os.path.join(base, f'{section}.jsx'), 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Section stubs created.')
