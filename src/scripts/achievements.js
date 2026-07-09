// #!node
// @ts-check

/** @typedef {string} AchievId */
/** @typedef {Record<AchievId, boolean>} AchievStates */
/** @typedef {{name: string, desc: string, imageStyle: string}} Achiev */
/** @typedef {Record<AchievId, Achiev>} Achievs */

const achievStates = {
  /**
   * @param {Achievs} achievs
   */
  create(achievs) {
    /** @type {AchievStates} */
    const states = {}
    Object.entries(achievs)
      .forEach(([key]) => {
        states[key] = false
      })
    return states
  },
  /** @param {AchievStates} states */
  reset(states) {
    Object.entries(states)
      .forEach(([key]) => {
        states[key] = false
      })
  },
}

const achievsStorageKey = "achievements"

/**
 * @param {{recall: any, memorize: any, forget: any, Dialog: any}} api
 * @param {Achiev[]} achievementsList
 */
function createAchievs(api, achievementsList) {
  const achievements = (() => {
    /** @type {Achievs} */
    const achievements = {}
    achievementsList
      .forEach(achiev => {
        achievements[achiev.name] = achiev
      })
    return achievements
  })()

  /** @type {AchievStates} */
  const states = api.recall(
    achievsStorageKey,
    achievStates.create(achievements)
  )

  return {
    states,

    achievements,

    /** @param {AchievId} id */
    unlock(id) {
      const isAchievementEarned = states[id]
      if (isAchievementEarned)
        return
      states[id] = true
      api.memorize(achievsStorageKey, states)
    },

    /** @param {AchievId} id */
    show(id) {
      const achiev = achievements[id]
      api.Dialog.setup(achiev.name)
      api.Dialog.wiki([
        `<div class="${achiev.imageStyle}"></div>`,
        `<p>${achiev.desc}</p>`,
      ].join(""))
      api.Dialog.open()
    },

    reset() {
      achievStates.reset(states)
      api.forget(achievsStorageKey)
    }
  }
}
