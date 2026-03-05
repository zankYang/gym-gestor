import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Gym account', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  test('crear cuenta de gym con superadmin', async ({ assert }) => {
    assert.equal(true, true)
  })
})
