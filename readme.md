// ❌ This WON'T work for file uploads
app.use(express.json()); // Only handles JSON data

// ✅ You NEED Multer to handle files
app.use(upload.single('audio')); // Multer handles file uploads
```

---

## **What Multer Does:**

1. **Parses multipart/form-data** (file upload format)
2. **Extracts the file** from the request
3. **Makes it available** as `req.file.buffer` (the audio data)
4. **Validates file type** (only allow audio files)
5. **Limits file size** (prevent huge uploads)

---

## **The Flow:**
```
┌──────────────┐
│   Browser    │
│              │
│ 1. Record    │
│    audio     │──┐
│              │  │
│ 2. Create    │  │
│    Blob      │  │
└──────────────┘  │
                  │
                  │ FormData (multipart/form-data)
                  │ Content-Type: multipart/form-data
                  │
                  ▼
         ┌────────────────┐
         │  Express +     │
         │  Multer        │
         │                │
         │  req.file = {  │
         │    buffer,     │──────▶ This is what AssemblyAI needs!
         │    mimetype,   │
         │    size        │
         │  }             │
         └────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  AssemblyAI    │
         │  transcribe    │
         │  (audioBuffer) │
         └────────────────┘


error boundary
