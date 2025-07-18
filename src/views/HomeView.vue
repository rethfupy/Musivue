<template>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
        <div
            class="absolute inset-0 w-full h-full bg-contain introduction-bg"
            style="background-image: url(assets/img/header.png)"
        ></div>
        <div class="container mx-auto">
            <div class="text-white main-header-content">
                <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
                <p class="w-full md:w-8/12 mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor
                    mollis, congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet
                    imperdiet, venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget,
                    ullamcorper urna.
                </p>
            </div>
        </div>

        <img
            class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
            src="/assets/img/introduction-music.png"
        />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <span class="card-title">Songs</span>
                <!-- Icon -->
                <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
            </div>
            <!-- Playlist -->
            <ol id="playlist">
                <song-item
                    v-for="(song, i) in songs"
                    :key="song.songID"
                    :song="song"
                    :index="i"
                ></song-item>
            </ol>
            <!-- .. end Playlist -->
        </div>
    </section>
</template>

<script>
import SongItem from '@/components/SongItem.vue'
import { songsCollection } from '@/includes/firebase'

export default {
    name: 'HomeView',
    components: {
        SongItem,
    },
    data() {
        return {
            songs: [],
            amountPerPage: 10,
            pendingRequest: false,
        }
    },
    async created() {
        this.getSongs()
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        async getSongs() {
            if (this.pendingRequest) {
                return
            }

            let records
            this.pendingRequest = true
            if (this.songs.length) {
                const lastRecord = this.songs[this.songs.length - 1].snapshot
                records = await songsCollection
                    .orderBy('modified_name')
                    .startAfter(lastRecord)
                    .limit(this.amountPerPage)
                    .get()
            } else {
                records = await songsCollection
                    .orderBy('modified_name')
                    .limit(this.amountPerPage)
                    .get()
            }

            records.forEach((record) => {
                this.songs.push({
                    ...record.data(),
                    songID: record.id,
                    snapshot: record,
                })
            })
            this.pendingRequest = false
        },
        handleScroll() {
            const { scrollTop, offsetHeight } = document.documentElement
            const { innerHeight } = window
            const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

            if (bottomOfWindow) {
                this.getSongs()
            }
        },
    },
}
</script>
