<template>
    <li
        class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    >
        <div>
            <router-link
                :to="{ name: 'song', params: { id: song.songID } }"
                class="font-bold block text-gray-600"
                >{{ song.modified_name }}</router-link
            >
            <span class="text-gray-500 text-sm">Uploaded by {{ song.display_name }}</span>
            <div class="text-gray-500 text-sm" v-if="song.genre != ''">
                <strong>{{ song.genre }}</strong>
            </div>
        </div>
        <div class="text-gray-600 text-lg">
            <router-link
                custom
                :to="{ name: 'song', params: { id: song.songID }, hash: '#comments' }"
                v-slot="{ navigate }"
            >
                <span class="comments" @click="navigate" v-icon="'comments'"></span>
                {{ song.comment_count }}
            </router-link>
        </div>
    </li>
</template>

<script>
export default {
    name: 'SongItem',
    props: {
        song: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },
}
</script>
