<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
            <button
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-500 hover:bg-red-600 hover:cursor-pointer float-right"
                @click.prevent="deleteSong"
            >
                <i class="fa fa-times"></i>
            </button>
            <button
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-500 hover:bg-blue-600 hover:cursor-pointer float-right"
                @click.prevent="showForm = true"
            >
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm">
            <div
                class="text-white text-center font-bold p-4 mb-4"
                v-if="show_alert"
                :class="alert_color"
            >
                {{ alert_message }}
            </div>
            <vee-form :validation-schema="schema" :initial-values="song" @submit="editSong">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field
                        type="text"
                        name="modified_name"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title"
                        @input="updateUnsavedFlag(true)"
                    />
                    <ErrorMessage class="text-red-600" name="modified_name" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field
                        type="text"
                        name="genre"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre"
                        @input="updateUnsavedFlag(true)"
                    />
                    <ErrorMessage class="text-red-600" name="genre" />
                </div>
                <button
                    type="submit"
                    class="py-1.5 px-3 rounded text-white bg-violet-500 mr-2 hover:bg-violet-600 hover:cursor-pointer"
                    :disabled="in_submission"
                >
                    Submit
                </button>
                <button
                    type="button"
                    class="py-1.5 px-3 rounded text-white bg-gray-500 hover:bg-gray-600 hover:cursor-pointer"
                    @click.prevent="showForm = false"
                >
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { songsCollection, storage } from '@/includes/firebase'

export default {
    name: 'CompositionItem',
    props: {
        song: {
            type: Object,
            required: true,
        },
        updateSong: {
            type: Function,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        removeSong: {
            type: Function,
            required: true,
        },
        updateUnsavedFlag: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            showForm: false,
            schema: {
                modified_name: 'required',
                genre: 'alpha_spaces',
            },
            in_submission: false,
            show_alert: false,
            alert_color: 'bg-blue-500',
            alert_message: 'Updating song in process.',
        }
    },
    methods: {
        async editSong(values) {
            this.in_submission = true
            this.show_alert = true
            this.alert_color = 'bg-blue-500'
            this.alert_message = 'Updating song in process.'

            try {
                await songsCollection.doc(this.song.songID).update(values)
            } catch (error) {
                this.in_submission = false
                this.alert_color = 'bg-red-500'
                this.alert_message = error
                return
            }

            this.updateSong(this.index, values)
            this.updateUnsavedFlag(false)

            this.in_submission = false
            this.alert_color = 'bg-green-500'
            this.alert_message = 'Song has been updated!'
        },
        async deleteSong() {
            const storageRef = storage.ref()
            const songRef = storageRef.child(`songs/${this.song.original_name}`)

            await songRef.delete()
            await songsCollection.doc(this.song.songID).delete()
            this.removeSong(this.index)
        },
    },
}
</script>
