<script>
  export let width = "100%";
  export let height = "100%";
  export let immediate = false;
</script>

<style>
  .processingAnimation {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.5);
    min-height: 1rem;
    animation: fadeIn 2s;
    animation-fill-mode: forwards;
    visibility: hidden;
  }
  .immediate {
    animation: fadeIn 0s;
  }
  svg {
    max-height: 5rem;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      visibility: visible;
      opacity: 1;
    }
  }
</style>

<div class="processingAnimation" class:immediate>
  <!-- <img src={`/img/loading.svg`} {width} {height} /> -->
  <svg
    {width}
    {height}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid">
    <g transform="rotate(0 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.9166666666666666s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(30 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.8333333333333334s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(60 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.75s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(90 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.6666666666666666s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(120 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.5833333333333334s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(150 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.5s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(180 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.4166666666666667s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(210 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.3333333333333333s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(240 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.25s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(270 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.16666666666666666s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(300 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="-0.08333333333333333s"
          repeatCount="indefinite" />
      </rect>
    </g>
    <g transform="rotate(330 50 50)">
      <rect
        x="47.5"
        y="21"
        rx="1.425"
        ry="0.63"
        width="5"
        height="14"
        fill="#000000">
        <animate
          attributeName="opacity"
          values="1;0"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite" />
      </rect>
    </g>
  </svg>

</div>
