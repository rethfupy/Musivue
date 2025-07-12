<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-violet-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <!-- Upload Dropbox -->
            <div
                class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-violet-400 hover:border-violet-400 hover:border-solid"
                :class="{ 'text-white bg-violet-400 border-violet-400 border-solid': is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)"
            >
                <h5>Drop your files here</h5>
            </div>
            <input id="file-upload" type="file" multiple @change="upload($event)" class="hidden" />
            <label
                for="file-upload"
                class="inline-flex items-center gap-2 px-4 py-2 mt-4 mb-2 text-white bg-violet-400 rounded-lg cursor-pointer hover:bg-violet-500 transition"
            >
                <i class="fas fa-upload"></i> Upload file
            </label>
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <!-- File Name -->
                <div class="font-bold text-sm" :class="upload.font_color">
                    <i :class="upload.icon"></i> {{ upload.name }}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div
                        class="transition-all progress-bar bg-blue-400"
                        :class="upload.status"
                        :style="{ width: upload.current_progress + '%' }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase'

export default {
    name: 'AppUpload',
    props: {
        addSong: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            is_dragover: false,
            uploads: [],
        }
    },
    methods: {
        upload($event) {
            this.is_dragover = false
            const files = $event.dataTransfer
                ? [...$event.dataTransfer.files]
                : [...$event.target.files]

            files.forEach((file) => {
                if (file.type !== 'audio/mpeg') {
                    return
                }

                const storageRef = storage.ref()
                const songRef = storageRef.child(`songs/${file.name}`)
                const load = songRef.put(file)

                const uploadIdx =
                    this.uploads.push({
                        load,
                        current_progress: 0,
                        name: file.name,
                        status: 'bg-blue-400',
                        icon: 'fas fa-spinner fa-spin',
                        font_color: '',
                    }) - 1

                load.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        this.uploads[uploadIdx].current_progress = progress
                    },
                    (error) => {
                        this.uploads[uploadIdx].status = 'bg-red-400'
                        this.uploads[uploadIdx].icon = 'fas fa-times'
                        this.uploads[uploadIdx].font_color = 'text-red-400'
                        console.error(error)
                    },
                    async () => {
                        const song = {
                            uid: auth.currentUser.uid,
                            display_name: auth.currentUser.displayName,
                            original_name: load.snapshot.ref.name,
                            modified_name: load.snapshot.ref.name,
                            genre: '',
                            comment_count: 0,
                        }

                        song.url = await load.snapshot.ref.getDownloadURL()
                        const uploadedSong = await songsCollection.add(song)
                        const songSnapshot = await uploadedSong.get()
                        this.addSong(songSnapshot)

                        this.uploads[uploadIdx].status = 'bg-green-400'
                        this.uploads[uploadIdx].icon = 'fas fa-check'
                        this.uploads[uploadIdx].font_color = 'text-green-400'
                    },
                )
            })
        },
        cancelUploads() {
            this.uploads.forEach((upload) => {
                upload.load.cancel()
            })
        },
    },
}
</script>
