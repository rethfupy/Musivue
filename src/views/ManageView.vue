<template>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <div class="col-span-1">
                <app-upload ref="upload" :addSong="addSong"></app-upload>
            </div>
            <div class="col-span-2">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <span class="card-title">My Songs</span>
                        <i class="fa fa-compact-disc float-right text-violet-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <composition-item
                            v-for="(song, i) in songs"
                            :key="song.songID"
                            :song="song"
                            :updateSong="updateSong"
                            :index="i"
                            :removeSong="removeSong"
                            :updateUnsavedFlag="updateUnsavedFlag"
                        ></composition-item>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import AppUpload from '@/components/AppUpload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'

export default {
    name: 'ManageView',
    components: {
        AppUpload,
        CompositionItem,
    },
    data() {
        return {
            songs: [],
            unsavedFlag: false,
        }
    },
    async created() {
        const records = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
        records.forEach(this.addSong)
    },
    beforeRouteLeave(to, from, next) {
        if (!this.unsavedFlag) {
            this.$refs.upload.cancelUploads()
            next()
            return
        }
        const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
        next(leave)
    },
    methods: {
        addSong(record) {
            const song = {
                ...record.data(),
                songID: record.id,
            }
            this.songs.push(song)
        },
        updateSong(i, values) {
            this.songs[i].modified_name = values.modified_name
            this.songs[i].genre = values.genre
        },
        removeSong(i) {
            this.songs.splice(i, 1)
        },
        updateUnsavedFlag(value) {
            this.unsavedFlag = value
        },
    },
}
</script>
