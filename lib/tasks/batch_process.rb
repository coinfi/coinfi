def batch_process(items)
  item_name = items.first.class.name
  puts "About to process #{items.count} #{item_name.pluralize}"
  puts "Nothing to do here. items was empty... bye." and return if items.none?

  progress = ProgressBar.create(:title => item_name.pluralize, :total => items.count)
  items_with_errors = []

  process_item_proc = lambda do |item|
    begin
      yield(item)
      progress.increment
    rescue StandardError => e
      items_with_errors << item.id
      puts "Got an error on #{item_name} id #{item.id}"
      puts e
      puts e.backtrace
      puts "#{items_with_errors.length} errors so far"
    end
  end

  if items.is_a? Array
    items.each &process_item_proc
  else
    items.find_each &process_item_proc
  end

  puts "Complete!"
  if items_with_errors.present?
    puts "Found #{items_with_errors.length} total errors"
    puts "Encountered errors when trying to process these #{item_name.pluralize} ids: #{items_with_errors}"
  end

  items_with_errors
end
