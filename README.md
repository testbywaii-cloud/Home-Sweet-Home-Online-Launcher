# HOME SWEET HOME ONLINE OPEN SOURE LAUNCHER

## Directory File

```
├── build/                # โฟลเดอร์เก็บไอคอนและทรัพยากรสำหรับการ Build
│   └── icon.ico          # ไอคอนโปรแกรม
├── certs/                # โฟลเดอร์เก็บ Root CA Certificate และ SSL Key[cite: 2]
├── mods/                 # โฟลเดอร์เก็บมอดต้นทางเพื่อ Sync ไปยังตัวเกม[cite: 2]
├── index.html            # หน้าต่าง UI หลัก ดีไซน์แบบ Liquid Glass[cite: 1, 2]
├── main.js               # Process หลักของ Electron (Proxy, IPC, File System)[cite: 2]
├── preload.js            # สะพานเชื่อมระหว่าง Main Process และ Renderer Process[cite: 2, 4]
├── renderer.js           # สคริปต์ควบคุม UI Interaction, Progress Overlay[cite: 5]
└── package.json          # ค่าการตั้งค่าโปรเจกต์และ dependencies
```
