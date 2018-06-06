task_id = ARGV[0]
unless task_id
  puts "usage ruby task_done.rb <task_id>"
  puts "task_id param was missing"
  return
end

require 'active_support/inflector'
require 'asana'

 personal_access_token = ENV.fetch('ASANA_PERSONAL_ACCESS_TOKEN')
 client = Asana::Client.new do |c|
   c.authentication :access_token, personal_access_token
 end

 task = client.tasks.find_by_id(task_id)

 branch_name = "#{task.name.parameterize}/#{task.id}"
`git checkout -b #{branch_name}`
`git add -A`
`git commit -m "#{task.name} ##{task.id}` 
`git push --set-upstream origin #{branch_name}`

#pull request
