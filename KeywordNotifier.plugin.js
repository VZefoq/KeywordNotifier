/**
 * @name KeywordNotifier
 * @author Zef
 * @version 1.2.0
 * @description Notifies you when specific keywords appear in selected Discord servers/channels.
 */

module.exports = class KeywordNotifier {
  constructor() {
    this.config = {
      name: "KeywordNotifier",
      version: "1.2.0",
      author: "zef",
      description: "Notifies you when specific keywords are used in selected channels or servers.",
    };

    this.settings = BdApi.loadData(this.config.name, "settings") || {
      keywords: "XZ,DD,Dragon",
      servers: "",
      channels: "",
    };
  }

  escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  start() {
    this.dispatcher = BdApi.findModuleByProps("dispatch", "subscribe");

    this.listener = ({ message }) => {
      if (!message || !message.content) return;

      const content = message.content.toLowerCase();
      const keywords = this.settings.keywords.toLowerCase().split(",").map(k => k.trim()).filter(Boolean);
      const servers = this.settings.servers.split(",").map(k => k.trim());
      const channels = this.settings.channels.split(",").map(k => k.trim());

      const match = keywords.find(word =>
        new RegExp(`\\b${this.escapeRegExp(word)}\\b`, "i").test(content)
      );

      const allowedServer = !servers.length || servers.includes(message.guild_id);
      const allowedChannel = !channels.length || channels.includes(message.channel_id);

      if (
        match &&
        allowedServer &&
        allowedChannel &&
        !/(\bnot\s+dd\b|\bno\s+dd\b)/i.test(content)
      ) {          
        BdApi.showToast(`🔔 Keyword "${match}" detected!`, { type: "info" });

        new Audio("https://www.dropbox.com/scl/fi/usa30xt59ij9z9sh3g6ux/oringz-w427-371.mp3?rlkey=4bibqzg0l6gzlzhe5uz1qcfm5&raw=1").play();
      }
    };

    this.dispatcher.subscribe("MESSAGE_CREATE", this.listener);
  }

  stop() {
    if (this.dispatcher && this.listener) {
      this.dispatcher.unsubscribe("MESSAGE_CREATE", this.listener);
    }
  }

  getSettingsPanel() {
    const panel = document.createElement("div");
    panel.style.padding = "16px";
    panel.style.color = "var(--text-normal)";
    panel.style.fontFamily = "var(--font-primary)";
    
    const title = document.createElement("h2");
    title.textContent = "Keyword Notifier Settings";
    title.style.marginBottom = "16px";
    title.style.color = "var(--header-primary)";
    title.style.fontWeight = "600";
    panel.appendChild(title);
    
    const description = document.createElement("p");
    description.textContent = "Configure which keywords to track and where to listen for them.";
    description.style.marginBottom = "20px";
    description.style.fontSize = "14px";
    description.style.color = "var(--text-muted)";
    panel.appendChild(description);

    const createInput = (labelText, key, placeholder, tooltip) => {
      const container = document.createElement("div");
      container.style.marginBottom = "20px";
      container.style.position = "relative";

      const labelContainer = document.createElement("div");
      labelContainer.style.display = "flex";
      labelContainer.style.alignItems = "center";
      labelContainer.style.marginBottom = "8px";

      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.fontWeight = "500";
      label.style.fontSize = "14px";
      label.style.color = "var(--header-secondary)";
      labelContainer.appendChild(label);

      if (tooltip) {
        const tooltipIcon = document.createElement("span");
        tooltipIcon.innerHTML = "ⓘ";
        tooltipIcon.style.marginLeft = "8px";
        tooltipIcon.style.cursor = "help";
        tooltipIcon.style.color = "var(--interactive-normal)";
        tooltipIcon.style.fontSize = "12px";

        const tooltipPopup = document.createElement("div");
        tooltipPopup.textContent = tooltip;
        tooltipPopup.style.position = "absolute";
        tooltipPopup.style.backgroundColor = "var(--background-floating)";
        tooltipPopup.style.color = "var(--text-normal)";
        tooltipPopup.style.padding = "8px 12px";
        tooltipPopup.style.borderRadius = "4px";
        tooltipPopup.style.fontSize = "12px";
        tooltipPopup.style.maxWidth = "250px";
        tooltipPopup.style.boxShadow = "0 2px 10px 0 rgba(0,0,0,0.2)";
        tooltipPopup.style.zIndex = "999";
        tooltipPopup.style.display = "none";
        tooltipPopup.style.top = "30px";
        tooltipPopup.style.left = "0";
        
        tooltipIcon.onmouseenter = () => tooltipPopup.style.display = "block";
        tooltipIcon.onmouseleave = () => tooltipPopup.style.display = "none";
        
        labelContainer.appendChild(tooltipIcon);
        container.appendChild(tooltipPopup);
      }
      
      container.appendChild(labelContainer);

      const input = document.createElement("input");
      input.type = "text";
      input.value = this.settings[key];
      input.placeholder = placeholder;
      input.style.width = "100%";
      input.style.padding = "10px";
      input.style.borderRadius = "3px";
      input.style.border = "1px solid var(--deprecated-text-input-border)";
      input.style.backgroundColor = "var(--deprecated-text-input-bg)";
      input.style.color = "var(--text-normal)";
      input.style.fontSize = "14px";
      input.style.transition = "border-color .2s ease-in-out";
      input.style.outline = "none";
      
      input.onfocus = () => {
        input.style.borderColor = "var(--brand-experiment)";
      };
      
      input.onblur = () => {
        input.style.borderColor = "var(--deprecated-text-input-border)";
      };
      
      input.oninput = (e) => {
        this.settings[key] = e.target.value;
        BdApi.saveData(this.config.name, "settings", this.settings);
      };
      
      container.appendChild(input);
      return container;
    };

    panel.appendChild(createInput(
      "Keywords", 
      "keywords", 
      "e.g. important,meeting,urgent", 
      "Enter keywords separated by commas. The plugin will notify you when these words appear in messages."
    ));
    
    panel.appendChild(createInput(
      "Server IDs", 
      "servers", 
      "e.g. 123456789,987654321", 
      "Optional: Enter server IDs separated by commas to restrict notifications to specific servers. Leave empty to listen in all servers."
    ));
    
    panel.appendChild(createInput(
      "Channel IDs", 
      "channels", 
      "e.g. 123456789,987654321", 
      "Optional: Enter channel IDs separated by commas to restrict notifications to specific channels. Leave empty to listen in all channels."
    ));

    // Add save button for visual confirmation
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save Settings";
    saveBtn.style.padding = "8px 16px";
    saveBtn.style.backgroundColor = "var(--brand-experiment)";
    saveBtn.style.color = "white";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "3px";
    saveBtn.style.fontSize = "14px";
    saveBtn.style.fontWeight = "500";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.transition = "background-color .2s ease";
    
    saveBtn.onmouseover = () => {
      saveBtn.style.backgroundColor = "var(--brand-experiment-560)";
    };
    
    saveBtn.onmouseout = () => {
      saveBtn.style.backgroundColor = "var(--brand-experiment)";
    };
    
    saveBtn.onclick = () => {
      BdApi.saveData(this.config.name, "settings", this.settings);
      BdApi.showToast("Settings saved!", {type: "success"});
    };
    
    panel.appendChild(saveBtn);

    // Add help section
    const helpSection = document.createElement("div");
    helpSection.style.marginTop = "24px";
    helpSection.style.padding = "12px";
    helpSection.style.backgroundColor = "var(--background-secondary)";
    helpSection.style.borderRadius = "5px";
    helpSection.style.fontSize = "13px";
    
    const helpTitle = document.createElement("h3");
    helpTitle.textContent = "How to use";
    helpTitle.style.marginBottom = "8px";
    helpTitle.style.fontSize = "14px";
    helpTitle.style.fontWeight = "600";
    helpSection.appendChild(helpTitle);
    
    const helpText = document.createElement("p");
    helpText.innerHTML = "• To get a Server ID or Channel ID, enable Developer Mode in Discord Settings → Advanced, then right-click on a server or channel and select 'Copy ID'.<br><br>• Keywords are case-insensitive and will match whole words only.";
    helpText.style.lineHeight = "1.5";
    helpText.style.color = "var(--text-muted)";
    helpSection.appendChild(helpText);
    
    panel.appendChild(helpSection);

    const versionInfo = document.createElement("div");
    versionInfo.textContent = `${this.config.name} v${this.config.version} by ${this.config.author}`;
    versionInfo.style.marginTop = "16px";
    versionInfo.style.fontSize = "12px";
    versionInfo.style.color = "var(--text-muted)";
    versionInfo.style.textAlign = "right";
    panel.appendChild(versionInfo);

    return panel;
  }
};
