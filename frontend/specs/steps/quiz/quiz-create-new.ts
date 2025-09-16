import { Then, When } from '../fixture.ts'

When('I start creating a quiz', async function () {
    await this.quizCreatePage.gotoNew()
})

Then('I see question list', async () => {
    // todo
})
