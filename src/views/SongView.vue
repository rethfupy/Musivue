<template>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
        <div
            class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
            style="background-image: url(/assets/img/song-header.png)"
        ></div>
        <div class="container mx-auto flex items-center">
            <!-- Play/Pause Button -->
            <button
                @click.prevent="newSong(song)"
                type="button"
                class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
                v-icon:full="'fas fa-play'"
            ></button>
            <div class="z-50 text-left ml-8">
                <!-- Song Info -->
                <div class="text-3xl font-bold">{{ song.modified_name }}</div>
                <div>{{ song.genre }}</div>
            </div>
        </div>
    </section>

    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div
                class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
                v-icon.right.green="'comments'"
            >
                <!-- Comment Count -->
                <span class="card-title">Comments ({{ song.comment_count }})</span>
            </div>
            <div class="p-6">
                <div
                    class="text-white text-center font-bold p-4 mb-4"
                    v-if="show_alert"
                    :class="alert_color"
                >
                    {{ alert_message }}
                </div>
                <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
                    <vee-field
                        as="textarea"
                        name="comment"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                        placeholder="Your comment here..."
                    ></vee-field>
                    <ErrorMessage class="text-red-600" name="comment" />
                    <button
                        type="submit"
                        class="py-1.5 px-3 rounded text-white bg-green-600 block"
                        :disabled="in_submission"
                    >
                        Submit
                    </button>
                </vee-form>
                <!-- Sort Comments -->
                <select
                    v-model="sort"
                    class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                >
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>
        </div>
    </section>

    <!-- Comments -->
    <ul class="container mx-auto">
        <li
            class="p-6 bg-gray-50 border border-gray-200"
            v-for="comment in sortedComments"
            :key="comment.commentID"
        >
            <!-- Comment Author -->
            <div class="mb-5">
                <div class="font-bold">{{ comment.name }}</div>
                <time>{{ formatDate(comment.date) }}</time>
            </div>
            <p>{{ comment.content }}</p>
        </li>
    </ul>
</template>

<script>
import { auth, songsCollection, commentsCollection } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
    name: 'SongView',
    data() {
        return {
            song: {},
            comments: [],
            sort: 'desc',
            schema: {
                comment: 'required|min:4',
            },
            in_submission: false,
            show_alert: false,
            alert_color: 'bg-blue-500',
            alert_message: 'Publishing your comment...',
        }
    },
    computed: {
        ...mapState(useUserStore, ['userLoggedIn']),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if (this.sort === 'desc') {
                    return new Date(b.date) - new Date(a.date)
                }

                return new Date(a.date) - new Date(b.date)
            })
        },
    },
    async created() {
        const songSnapshot = await songsCollection.doc(this.$route.params.id).get()
        if (!songSnapshot.exists) {
            this.$router.push({ name: 'home' })
            return
        }

        const { sort } = this.$route.query
        this.sort = sort === 'desc' || sort === 'asc' ? sort : 'desc'

        this.song = songSnapshot.data()
        this.getComments()
    },
    methods: {
        ...mapActions(usePlayerStore, ['newSong']),
        async addComment(values, { resetForm }) {
            this.in_submission = true
            this.show_alert = true
            this.alert_color = 'bg-blue-500'
            this.alert_message = 'Publishing your comment...'

            const comment = {
                content: values.comment,
                date: new Date().toString(),
                sid: this.$route.params.id,
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
            }

            try {
                await commentsCollection.add(comment)
                await songsCollection
                    .doc(this.$route.params.id)
                    .update({ comment_count: this.song.comment_count + 1 })
            } catch (error) {
                this.in_submission = false
                this.alert_color = 'bg-red-500'
                this.alert_message = error
                return
            }

            this.getComments()

            this.in_submission = false
            this.alert_color = 'bg-green-500'
            this.alert_message = 'Comment has been published!'

            resetForm()
        },
        async getComments() {
            const records = await commentsCollection.where('sid', '==', this.$route.params.id).get()

            this.comments = []
            records.forEach((record) => {
                this.comments.push({
                    commentID: record.id,
                    ...record.data(),
                })
            })
        },
        formatDate(value) {
            const date = new Date(value)
            const now = new Date()
            const diff = (now - date) / 1000

            if (diff < 60) return 'Just now'
            if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
            if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`

            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        },
    },
    watch: {
        sort(newVal) {
            if (newVal === this.$route.query.sort) {
                return
            }
            this.$router.push({
                query: {
                    sort: newVal,
                },
            })
        },
    },
}
</script>
