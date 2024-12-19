import mitt from "mitt";

export default defineNuxtPlugin(() => {
  const emitter = mitt();

  return {
    provide: {
      mittEmit: emitter.emit, // Will emit an event
      mittOn: emitter.on, // Will register a listener for an event
    },
  };
});
