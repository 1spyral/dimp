import { afterEach, mock } from "bun:test"

afterEach(() => {
    // Keep tests isolated when Bun mocks/spies are used.
    mock.restore()
})
