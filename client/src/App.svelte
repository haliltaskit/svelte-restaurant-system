<script>
  import Header from "./UI/Header.svelte";
  import MenuGrid from "./Menus/MenuGrid.svelte";

  let menus = [];


</script>

<style>
  main {
    margin-top: 5rem;
  }

</style>

<Header />

<main>
  <MenuGrid {menus} />
</main>
