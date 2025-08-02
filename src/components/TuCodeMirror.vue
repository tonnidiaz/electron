<script setup lang="ts">
    import CodeMirror from 'vue-codemirror6';
    import { json } from "@codemirror/lang-json";
    import { oneDark } from '@codemirror/theme-one-dark'

</script>
<template>
    <CodeMirror basic class="h-full" :extensions="[oneDark]" dark :lang="json()" />
</template>