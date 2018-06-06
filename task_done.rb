task_id = ARGV[0]
unless task_id
  puts "usage ruby task_done.rb <task_id>"
  puts "task_id param was missing"
  return
end

PROJECT_ID= '683768070860536'

require 'active_support/inflector'
require 'asana'

 personal_access_token = ENV.fetch('ASANA_PERSONAL_ACCESS_TOKEN')
 client = Asana::Client.new{ |c| c.authentication :access_token, personal_access_token }

 task = client.tasks.find_by_id(task_id)

 branch_name = "#{task.name.parameterize}/#{task.id}"
`git checkout -b #{branch_name}`
`git add -A`

title = task.name.gsub("`","").strip
`git commit -m "#{ttle} ##{task.id}"` 
`git push --set-upstream origin #{branch_name}`

task_url = "https://app.asana.com/0/#{PROJECT_ID}/#{task.id}"
#pull request
pr_message = "#{title}\n#{task_url}"
`hub pull-request -m "#{pr_message}"`
